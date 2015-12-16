/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  showcaseSchema = new Schema({
    createdAt   : { type : Date },
    description : { type : String },
    name        : { type : String, required : true },
    updatedAt   : { type : Date },
    creator     : { type : Schema.Types.ObjectId, required : true }
  });

/**
 * Validations
 */
showcaseSchema.path('name').validate(function(showcaseName, fn) {
  fn(this.skipValidation() || showcaseName.length);
}, 'showcase.name cannot be blank');

showcaseSchema.path('name').validate(function(name, fn) {
  var Showcase = mongoose.model('Showcase');
  if (this.skipValidation()) fn(true);

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('name')) {
    Showcase.find({ name : name }).exec(function(err, showcases) {
      fn(!err && showcases.length === 0);
    });
  } else fn(true);
}, 'showcase.name already taken (unique)');

showcaseSchema.path('creator').validate(function(showcaseCreator, fn) {
  fn(this.skipValidation() || showcaseCreator.length);
}, 'showcase.creator cannot be blank');

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
