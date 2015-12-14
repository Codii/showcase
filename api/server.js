var _ = require('lodash'),
  express = require('express'),
  mongoose = require('mongoose'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  fs = require('fs'),
  passport = require('passport'),
  join = require('path').join,
  app = express(),
  connectMongo = function(config) {
    var options = { server : { socketOptions : { keepAlive : 1 } } };
    mongoose.connect(config.dbUrl, options);
  };

module.exports = function(env) {
  env = _.contains(['dev', 'prod', 'test']) ? env : 'dev';
  var appConfig = require('./config/config')[env];
  // Init connection to database
  connectMongo(appConfig);
  mongoose.connection.on('error', console.log);
  mongoose.connection.on('disconnected', connectMongo);

  // Bootstrap models
  fs.readdirSync(join(__dirname, 'app/models')).forEach(function(file) {
    if (/\.js$/.test(file)) require(join(__dirname, 'app/models', file));
  });

  app
    .use(bodyParser.urlencoded({extended : 'true'}))
    .use(bodyParser.json())
    .use(bodyParser.json({ type : 'application/vnd.api+json'}))
    .use(methodOverride());
  if (appConfig.morganEnv) {
    app.use(morgan(appConfig.morganEnv));
  }

  require('./config/routes')(app, passport);

  require('./config/passport')(passport, appConfig);

  // Must be called last
  app.use(function(err, req, res, next) {
    res.statusCode = err.withHttpStatus || 500;
    return res
      .json({ error : err.message });
  });

  return app;
}
