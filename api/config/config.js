var _ = require('lodash'),
  devEnvConfig = require('./env/dev'),
  testEnvConfig = require('./env/test');

_defaults = {
  port : 9001
};

module.exports = {
  dev  : _.extend(_defaults, devEnvConfig),
  test : _.extend(_defaults, testEnvConfig)
}
