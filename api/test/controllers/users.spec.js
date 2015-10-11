var chai = require('chai'),
  expect = chai.expect,
  request = require('supertest'),
  testHelpers = require('../helpers'),
  server = testHelpers.getServer(),
  User = require('../../app/models/user').model;

describe('Users', function() {
  var fakeUserData = {
      firstName : 'Pablo',
      lastName  : 'Escobar',
      name      : 'pablo',
      email     : 'pablo.escobar@yopmail.com',
      password  : 'imInLoveWithTheCoca'
    },
    fakeUser;
  beforeEach(function(done) {
    fakeUser = new User(fakeUserData);
    fakeUser.save(done);
  });
  describe('#create', function() {
    it('should not create user as it already exists', function(done) {
      request(server)
        .post('/users')
        .send(fakeUserData)
        .end(function(err, res) {
          if (err) {
            console.log(err);
            done.fail(err);
          } else {
            expect(res.status).to.equal(500);
            done();
          }
        });
    })
  });
  afterEach(function(done) {
    fakeUser = null;
    testHelpers.clearDb(done);
  });
});
