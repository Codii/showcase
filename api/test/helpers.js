
/**
 * Module dependencies.
 */

var async = require('async'),
  testEnv = 'test',
  server = require('../server')(testEnv),
  UserModel = require('../app/models/user').model;

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function(done) {
  async.parallel([
    function(cb) {
      UserModel.collection.remove(cb)
    }
  ], done)
}

exports.getServer = function() {
  return server;
}
