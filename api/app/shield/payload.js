var _ = require('lodash');

module.exports = {
  restrict : restrict
};


function restrict(source, fields, dontOmit) {
  if (!_.isArray(fields) || !_.isObject(source)) {
    return;
  }
  var payload = {};

  fields.forEach(function(field) {
    payload[field] = _.get(source, field);
  });

  if (!dontOmit) {
    payload = _.omit(payload, _.isUndefined);
  }

  return _.keys(payload).length == fields.length ? payload : null;
}
