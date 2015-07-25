var express = require('express'),
  mongoose = require('mongoose'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser')

  dbConfig = require('config/database'),
  appConfig = require('config/app'),

  app = express()
  ;

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

require('app/routes')(app);

app.listen(process.env.PORT || appConfig.port);
console.log("App listening on port " + port);
