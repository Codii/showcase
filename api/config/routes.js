var users = require('../app/controllers/users');

module.exports = function(app, passeport) {
  app.get('/users', users.index);
}
