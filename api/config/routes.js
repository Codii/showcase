var users = require('../app/controllers/users'),
  passport = require('passport');

module.exports = function(app, passeport) {
  app.get('/users', users.index);
}
