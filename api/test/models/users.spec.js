var mongoose = require('mongoose'),
  chai = require('chai'),
  expect = chai.expect,
  _ = require('lodash'),
  testHelpers = require('../helpers'),
  users = require('../../app/models/user.js'),
  UserModel = users.model;


describe('Users', function() {
  var fakeEmail = 'fake@yopmail.com',
    fakeUser;

  beforeEach(function(done) {
    UserModel.create({
      email    : fakeEmail,
      name : 'fakeUser',
      password : 'fakefakefake'
    }, done);
  });

  describe('#findByEmail()', function() {
    it('should find the fake user', function(done) {
      UserModel.findByEmail(fakeEmail, function(err, users) {
        if (err) {
          return done();
        }
        fakeUser = _.first(users);
        expect(fakeUser).to.be.ok;
        done();
      });
    });
  });

  afterEach(function(done) {
    testHelpers.clearDb(done);
  });
});
