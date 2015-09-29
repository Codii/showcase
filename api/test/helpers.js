
/**
 * Module dependencies.
 */

var async = require('async'),
  chai = require('chai'),
  passport = require('chai-passport-strategy'),
  users = require("../app/models/user.js"),
  UserModel = users.model
  ;


/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

chai.use(passport);

exports.clearDb = function (done) {
  async.parallel([
    function (cb) {
      UserModel.collection.remove(cb)
    }
  ], done)
}
