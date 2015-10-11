
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  passport = require('passport-strategy'),
  util = require('util');


/**
 * Creates an instance of `TokenStrategy`.
 *
 * The HTTP Bearer authentication strategy authenticates requests based on
 * a bearer token contained in the `Authorization` header field, `access_token`
 * body parameter, or `access_token` query parameter.
 *
 * Applications must supply a `verify` callback, for which the function
 * signature is:
 *
 *     function(token, done) { ... }
 *
 * `token` is the bearer token provided as a credential.  The verify callback
 * is responsible for finding the user who posesses the token, and invoking
 * `done` with the following arguments:
 *
 *     done(err, user, info);
 *
 * If the token is not valid, `user` should be set to `false` to indicate an
 * authentication failure.  Additional token `info` can optionally be passed as
 * a third argument, which will be set by Passport at `req.authInfo`, where it
 * can be used by later middleware for access control.  This is typically used
 * to pass any scope associated with the token.
 *
 * Options:
 *
 *   - `realm`  authentication realm, defaults to "Users"
 *   - `scope`  list of scope values indicating the required scope of the access
 *              token for accessing the requested resource
 *
 * Examples:
 *
 *     passport.use(new BearerStrategy(
 *       function(token, done) {
 *         User.findByToken({ token: token }, function (err, user) {
 *           if (err) { return done(err); }
 *           if (!user) { return done(null, false); }
 *           return done(null, user, { scope: 'read' });
 *         });
 *       }
 *     ));
 *
 * For further details on HTTP Bearer authentication, refer to [The OAuth 2.0 Authorization Protocol: Bearer Tokens](http://tools.ietf.org/html/draft-ietf-oauth-v2-bearer)
 *
 * @constructor
 * @param {Object} [options]
 * @param {Function} verify
 * @api public
 */
function TokenStrategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) {
    throw new TypeError('HTTPBearerStrategy requires a verify callback');
  }

  passport.Strategy.call(this);
  this.name = 'bearer';
  this._verify = verify;
  this._realm = options.realm || 'Users';
  if (options.scope) {
    this._scope = (Array.isArray(options.scope)) ? options.scope : [options.scope];
  }
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.TokenStrategy`.
 */
util.inherits(TokenStrategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a HTTP Bearer authorization
 * header, body parameter, or query parameter.
 *
 * @param {Object} req
 * @api protected
 */
TokenStrategy.prototype.authenticate = function(req) {
  var _this = this,
    token, parts, scheme;

  if (req.headers && req.headers.authorization) {
    parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      scheme = parts[0] , credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return this.fail(400);
    }
  }

  if (req.body && req.body.access_token) {
    if (token) {
      return this.fail(400);
    }
    token = req.body.access_token;
  }

  if (req.query && req.query.access_token) {
    if (token) {
      return this.fail(400);
    }
    token = req.query.access_token;
  }

  if (!token) {
    return this.fail(this._challenge());
  }

  function verified(err, user, info) {
    if (err) {
      return _this.error(err);
    }
    if (!user) {
      if (typeof info == 'string') {
        info = { message : info }
      }
      info = info || {};
      return _this.fail(_this._challenge('invalid_token', info.message));
    }
    _this.success(user, info);
  }

  if (_this._passReqToCallback) {
    this._verify(req, token, verified);
  } else {
    this._verify(token, verified);
  }
};

/**
 * Build authentication challenge.
 *
 * @api private
 */
TokenStrategy.prototype._challenge = function(code, desc, uri) {
  var challenge = 'Bearer realm="' + this._realm + '"';
  if (this._scope) {
    challenge += ', scope="' + this._scope.join(' ') + '"';
  }
  if (code) {
    challenge += ', error="' + code + '"';
  }
  if (desc && desc.length) {
    challenge += ', error_description="' + desc + '"';
  }
  if (uri && uri.length) {
    challenge += ', error_uri="' + uri + '"';
  }

  return challenge;
};

/**
 * Expose
 */

module.exports = TokenStrategy;
