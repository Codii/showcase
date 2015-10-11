
/**
 * Module dependencies.
 */

var async = require('async'),
  testEnv = 'test',
  server = require('../server')(testEnv),
  UserModel = require('../app/models/user').model,
  serverPort = process.env.PORT || 19002;

// server//
//   .listen(serverPort);
//
// console.info('App [' + testEnv.toUpperCase() + '] listening on port ' + serverPort);

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
