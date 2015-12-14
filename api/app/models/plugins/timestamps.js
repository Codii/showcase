module.exports = function timestampsPlugin(schema, options) {
  schema.add({ createdAt : Date });
  schema.add({ modifiedAt : Date });

  schema.pre('save', function(next) {
    var now = new Date();
    if (this.isNew) {
      this.createdAt = now;
    }
    this.modifiedAt = now;
    return next();
  });
}
