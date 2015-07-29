var _ = require('lodash'),
  developmentEnvConfig = require('./env/development');

_defaults = {
  port : 9001
};

module.exports = {
  development : _.extend(_defaults, developmentEnvConfig)
}[process.env.APP_ENV || 'development']
