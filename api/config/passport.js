2/**
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

module.exports = function(passport, config) {
  // use these strategies
  passport.use(new TokenStrategy(
    function(token, done) {
      var options = {
        criteria : { authToken : token }
      };
      User.load(options, function(err, user) {
        if (err) return done(err);
        if (!user) {
          return done(null, false, { message : 'Invalid auth token' });
        }
        return done(null, user);
      });
    }
  ));
};
