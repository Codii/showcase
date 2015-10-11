var express = require('express'),
  mongoose = require('mongoose'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  fs = require('fs'),
  passport = require('passport'),
  join = require('path').join,

  appConfig = require('./config/config'),
  appConfigPort = appConfig.port,
  app = express(),
  // Connect to mongodb
  connect = function() {
    var options = { server : { socketOptions : { keepAlive : 1 } } };
    mongoose.connect(appConfig.dbUrl, options);
  }
  ;

connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(join(__dirname, 'app/models')).forEach(function(file) {
  if (/\.js$/.test(file)) require(join(__dirname, 'app/models', file));
});

app
  .use(express.static(__dirname + '/public'))
  .use(morgan(appConfig.morganEnv))
  .use(bodyParser.urlencoded({extended : 'true'}))
  .use(bodyParser.json())
  .use(bodyParser.json({ type : 'application/vnd.api+json'}))
  .use(methodOverride())
  .use(function(err, req, res, next) {
    
    return res.json({ message : err });
  });

require('./config/routes')(app, passport);

require('./config/passport')(passport, appConfig);

app.listen(process.env.PORT || appConfigPort);
console.log('App listening on port ' + appConfigPort);
