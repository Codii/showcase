var users = require('../app/controllers/users'),
  auth = require('../config/middlewares/authorization.js');

module.exports = function(app, passport) {
  app.post('/login', users.login);
  app.post('/logout', auth.requiresLogin, users.create);

  // Users
  app.post('/users', users.create);
}
