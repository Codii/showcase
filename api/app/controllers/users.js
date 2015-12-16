var _ = require('lodash'),
  mongoose = require('mongoose'),
  payloadShield = require('../shield/payload'),
  User = mongoose.model('User');

exports.login = function(req, res, next) {
  var payload = payloadShield.restrict(req.body, ['email', 'password']);

  if (!payload) {
    var err = new Error('Missing email, password or both');
    err.withHttpStatus = 400;
    return next(err);
  }

  User.findByEmail(payload.email, function(err, users) {
    var user = _.first(users), err;
    if (err) return next(new Error(err))
    if (!user || !user.authenticate(payload.password)) {
      err = new Error('Could not authenticate user');
      err.withHttpStatus = 401;
      return next(err);
    }
    // Update lastSignin
    user.lastSignin = new Date();
    user.save();
    return res.json({
      authToken : user.authToken,
      userId    : user._id
    });
  });
};


exports.index = function(req, res) {
  var page = (req.params.page > 0 ? req.params.page : 1) - 1,
    perPage = 30,
    options = {
      perPage : perPage,
      page    : page
    };

  User.list(options, function(err, users) {
    if (err) return res.render('500');
    User.count().exec(function(err, count) {
      res.json({
        users : users,
        page  : page + 1,
        pages : Math.ceil(count / perPage)
      });
    });
  });
};

exports.create = function(req, res, next) {
  var payload = payloadShield.restrict(req.body, ['email', 'password', 'name', 'firstName', 'lastName']),
    user;

  if (!payload) {
    var err = new Error('Bad payload');
    err.withHttpStatus = 400;
    return next(err);
  }

  user = User(payload);

  user.save(function(err, user) {
    if (err) {
      return next(err);
    }
    res.json(user);
  });
};
