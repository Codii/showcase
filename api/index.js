var appEnv = process.env.APP_ENV || 'dev',
  appPort = process.env.PORT || 9001,
  app = require('./server')(appEnv);

app.listen(appPort);
console.log('App [' + appEnv.toUpperCase() + '] listening on port ' + appPort);
