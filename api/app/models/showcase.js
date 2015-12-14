/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  schema = {
    createdAt   : { type : Date },
    description : { type : String },
    name        : { type : String },
    updatedAt   : { type : Date },
    userId      : { type : String }
  },
  showcaseSchema = new mongoose.Schema(schema);

/**
 * Validations
 */
showcaseSchema.path('name').validate(function(showcaseName) {
  return this.skipValidation() || showcaseName.length;
}, 'Name cannot be blank');

showcaseSchema.path('name').validate(function(name, fn) {
  var Showcase = mongoose.model('Showcase');
  if (this.skipValidation()) fn(true);

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('name')) {
    Showcase.find({ name : name }).exec(function(err, showcases) {
      fn(!err && showcases.length === 0);
    });
  } else fn(true);
}, 'Showcase name already exists');

/**
 * Pre-save hook
 */

showcaseSchema.pre('save', function(next) {
  return next();
});

/**
 * Methods
 */
showcaseSchema.methods = {
  /**
   * Validation is not required if using OAuth
   */
  skipValidation : function() {
    return false;
  }
};

showcaseSchema.statics = {
  /**
   * List showcases
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
  list : function(options, cb) {
    var criteria = options.criteria || {};

    this.find(criteria)
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
};

module.exports = {
  schema : showcaseSchema,
  model  : mongoose.model('Showcase', showcaseSchema)
};
