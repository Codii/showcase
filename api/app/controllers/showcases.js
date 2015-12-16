var _ = require('lodash'),
  payloadShield = require('../shield/payload'),
  mongoose = require('mongoose'),
  Showcase = mongoose.model('Showcase');

exports.index = function(req, res, next) {
  var page = (req.params.page > 0 ? req.params.page : 1) - 1,
    perPage = 30,
    options = {
      perPage : perPage,
      page    : page
    };

  Showcase.list(options, function(err, showcases) {
    if (err) return res.render('500');
    Showcase.count().exec(function(err, count) {
      res.json({
        showcases : showcases,
        page      : page + 1,
        pages     : Math.ceil(count / perPage)
      });
    });
  });
};

exports.create = function(req, res, next) {
  var payload = payloadShield.restrict(req.body, ['name']),
    showcase = new Showcase(payload);

  if (!payload) {
    var err = new Error('Bad payload');
    err.withHttpStatus = 400;
    return next(err)
  }

  showcase.save(function(err, showcase) {
    if (err) {
      return next(err);
    }
    res.json(showcase);
  });
};
