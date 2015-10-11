var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.login = function(req, res, next) {
  var payload = _validate({
    email    : req.body.email,
    password : req.body.password
  });
  User.findByEmail(payload.email, function(err, users) {
    var user = _.first(users);
    if (err) return next(new Error(err))
    if (!user || !user.authenticate(payload.password)) {
      return next(new Error('Could not authenticate user'));
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
  var payload = new _validate({
      email     : req.body.email,
      password  : req.body.password,
      name      : req.body.name,
      firstName : req.body.firstName,
      lastName  : req.body.lastName
    }),
    user = new User(payload);

  user.save(function(err, user) {
    if (err) {
      return next(new Error(err));
    }
    res.json(user);
  });
}

function _validate(payload) {
  return _.chain(payload)
    .omit(_.isUndefined)
    .omit(_.isNull)
    .value();
}
