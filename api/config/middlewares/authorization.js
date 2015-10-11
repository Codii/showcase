/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    next(new Error('Need to be authd'));
  }
}
