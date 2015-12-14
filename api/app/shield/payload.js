var _ = require('lodash');

module.exports = {
  restrict : restrict
};


function restrict(source, fields) {
  if (!_.isArray(fields) || !_.isObject(source)) {
    return;
  }
  var payload = {};

  fields.forEach(function(field) {
    payload[field] = _.get(source, field);
  });

  payload = _.omit(payload, _.isUndefined);

  console.log(payload)

  return _.keys(payload).length == fields.length ? payload : null;
}
