var chai = require('chai'),
  expect = chai.expect,
  _ = require('lodash'),
  testHelpers = require('../helpers'),
  users = require('../../app/models/user.js'),
  UserModel = users.model;

describe('Users', function() {
  var fakeEmail = 'fake@yopmail.com',
    fakeUserData = {
      email    : fakeEmail,
      name     : 'fake_user',
      password : 'thispasswordisfake'
    },
    fakeUser;

  beforeEach(function(done) {
    fakeUser = new UserModel(fakeUserData);

    fakeUser.save(function(err) {
      done();
    });
  });

  it('should not let the fake user be created twice', function(done) {
    UserModel.create(fakeUserData, function(err) {
      expect(err).to.be.ok;
      done();
    });
  });

  describe('#findByEmail()', function() {
    it('should find the fake user', function(done) {
      UserModel.findByEmail(fakeEmail, function(err, users) {
        expect(err).not.to.be.ok;
        fakeUser = _.first(users);
        expect(fakeUser).to.be.ok;
        expect(fakeUser.email).to.equal(fakeUserData.email);
        done();
      });
    });
  });

  afterEach(function(done) {
    fakeUser = null;
    testHelpers.clearDb(done);
  });
});
