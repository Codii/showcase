var mongoose = require('mongoose'),
  should = require('should'),
  _ = require('lodash'),
  testHelpers = require('./helpers'),
  users = require("../app/models/user.js"),
  UserModel = users.model;

mongoose.connect('mongodb://localhost/showcase_test');

describe('Users', function() {
  var fakeEmail = "fake@yopmail.com",
    fakeUser;

  beforeEach(function(done){
    testHelpers.clearDb();
    UserModel.create({
      email : fakeEmail,
      username : "fakeUser",
      password : "fakefakefake"
    }, done);
  });

  describe('#findByEmail()', function () {
    it('should find the fake user', function (done) {
      UserModel.findByEmail(fakeEmail, function(err, users) {
        if (err) {
          return done();
        }
        fakeUser = _.first(users);
        should(fakeUser).be.ok();
        done();
      });
    });
  });

  afterEach(function(){
    testHelpers.clearDb();
  });
});
