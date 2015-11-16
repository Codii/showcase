/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  crypto = require('crypto'),
  validator = require('validator'),
  userSchema = new mongoose.Schema({
    firstName      : { type : String, default : '' },
    lastName       : { type : String, default : '' },
    email          : { type : String, default : '' },
    lastSignin     : { type : String, default : '' },
    name           : { type : String, default : '' },
    hashedPassword : { type : String, default : '' },
    authToken      : { type : String, default : '' },
    salt           : { type : String, default : '' }
  });

/**
 * Virtuals
 */

userSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encrypt(password);
  })
  .get(function() {
    return this._password
  });

/**
 * Validations
 */

function validatePresenceOf(value) {
  return value && value.length;
};

userSchema.path('email').validate(function(email, fn) {
  return fn(this.skipValidation() || validator.isEmail(email));
}, 'Email must be valid');

userSchema.path('email').validate(function(email, fn) {
  var User = mongoose.model('User');
  if (this.skipValidation()) fn(true);

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email : email }).exec(function(err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'Email already exists');

userSchema.path('name').validate(function(username) {
  if (this.skipValidation()) return true;
  return username.length;
}, 'Username cannot be blank');

userSchema.path('hashedPassword').validate(function(hashedPassword) {
  if (this.skipValidation()) return true;
  return hashedPassword.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

userSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && !this.skipValidation()) {
    return next(new Error('Invalid password'));
  } else {
    this.authToken = this.generateAuthToken();
    return next();
  }
});

/**
 * Methods
 */
userSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate : function(plainText) {
    return this.encrypt(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt : function() {
    return Math.round((new Date().valueOf() * Math.random())).toString();
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encrypt : function(password) {
    if (!password) {
      return '';
    }
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  /**
   * Generate auth token
   *
   * @return {String}
   * @api public
   */

  generateAuthToken : function() {
    try {
      return crypto
        .randomBytes(20)
        .toString('hex');
    } catch (err) {
      return '';
    }
  },

  /**
   * Validation is not required if using OAuth
   */

  skipValidation : function() {
    return false;
  }
};

userSchema.statics = {
  /**
   * List users
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
  },
  /**
   * Find by email
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
  findByEmail : function(email, cb) {
    this.find({
      email : email
    }, cb);
  },
  /**
   * Find user by authToken
   *
   * @param {Object} authToken
   * @param {Function} cb
   * @api private
   */
  findByAuthToken : function(authToken, cb) {
    this.find({
      authToken : authToken
    }, cb);
  }
};

module.exports = {
  schema : userSchema,
  model  : mongoose.model('User', userSchema)
};
