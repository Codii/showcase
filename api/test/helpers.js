
/**
 * Module dependencies.
 */

var async = require('async'),
  testEnv = 'test',
  server = require('../server')(testEnv),
  UserModel = require('../app/models/user').model,
  ShowcaseModel = require('../app/models/showcase').model;

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function(done) {
  async.parallel([
    function(done) {
      return UserModel.collection.remove(done);
    },
    function(done) {
      return ShowcaseModel.collection.remove(done);
    }
  ], done);
};

exports.getServer = function() {
  return server;
};
