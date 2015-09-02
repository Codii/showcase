/**
 * Created by cedricodi on 31/07/15.
 */

/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');

var token = require('./passport/token');
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
  passport.use(token);
};