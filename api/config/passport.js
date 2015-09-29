/**
 * Created by cedricodi on 31/07/15.
 */

/*!
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  TokenStrategy = require('./passport/tokenStrategy');
/**
 * Expose
 */

module.exports = function (passport, config) {
  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.load({ criteria: { _id: id } }, function (err, user) {
      done(err, user)
    })
  })

  // use these strategies
  passport.use(new TokenStrategy(
    function(token, done) {
      var options = {
        criteria: { token: token },
        select: 'username email hashed_password salt'
      };
      User.load(options, function (err, user) {
        if (err) return done(err);
        if (!user) {
          return done(null, false, { message: 'Invalid auth token' });
        }
        return done(null, user);
      });
    }
  ));
};
