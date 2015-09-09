
/**
 * Module dependencies.
 */

var async = require('async'),
  users = require("../app/models/user.js"),
  UserModel = users.model
  ;

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function (done) {
  async.parallel([
    function (cb) {
      UserModel.collection.remove(cb)
    }
  ], done)
}
