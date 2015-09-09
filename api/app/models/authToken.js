/**
 * Created by cedricodi on 31/07/15.
 */

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

/**
 * User Schema
 */

var AuthTokenSchema = new Schema({
  secret: { type: String, default: '' }
});

/**
 * Pre-save hook
 */

AuthTokenSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  this.secret = this.generateSecret(password);

  next();
})


/**
 * Methods
 */

AuthTokenSchema.methods = {
  generateSecret : function (user) {
    try {
      return crypto
        .createHmac('sha1', user.salt)
        .update()
        .digest('hex');
    } catch (err) {
      return '';
    }
  }
};

mongoose.model('AuthToken', AuthTokenSchema);
