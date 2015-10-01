var mongoose = require('mongoose'),
  User = mongoose.model('User');

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
        title : 'Users',
        users : users,
        page  : page + 1,
        pages : Math.ceil(count / perPage)
      });
    });
  });
}
