
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new LocalStrategy({
    tokenField: 'token'
  },
  function(token, done) {
    var options = {
      criteria: { token: token },
      select: 'username email hashed_password salt'
    };
    User.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Invalid auth token' });
      }
      return done(null, user);
    });
  }
);
