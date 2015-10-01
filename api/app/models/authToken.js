/**
 * Created by cedricodi on 31/07/15.
 */

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,

/**
 * User Schema
 */

  AuthTokenSchema = new Schema({
    userId : { type : ObjectId, nullable : false  },
    secret : { type : String, nullable : false }
  })

;

/**
 * Pre-save hook
 */

AuthTokenSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  next();
})


/**
 * Methods
 */

AuthTokenSchema.methods = {

};

mongoose.model('AuthToken', AuthTokenSchema);
