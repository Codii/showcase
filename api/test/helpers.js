
/**
 * Module dependencies.
 */

var async = require('async'),
  mongoose = require('mongoose'),
  users = require('../app/models/user.js'),
  UserModel = users.model;

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

mongoose.connect('mongodb://localhost/showcase_test');

exports.clearDb = function(done) {
  async.parallel([
    function(cb) {
      UserModel.collection.remove(cb)
    }
  ], done)
}
