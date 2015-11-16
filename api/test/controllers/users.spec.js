var chai = require('chai'),
  expect = chai.expect,
  _ = require('lodash'),
  request = require('supertest'),
  testHelpers = require('../helpers'),
  server = testHelpers.getServer(),
  User = require('../../app/models/user').model;

describe('Users', function () {
  var fakeUserData = {
      firstName: 'Pablo',
      lastName: 'Escobar',
      name: 'pablo',
      email: 'pablo.escobar@yopmail.com',
      password: 'imInLoveWithTheCoca'
    },
    fakeUser;
  describe('#create', function () {
    it('should create user with fake data', function (done) {
      request(server)
        .post('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(fakeUserData)
        .end(function (err, res) {
          expect(res.status).to.equal(200);
          done();
        });
    })
  });
  afterEach(function (done) {
    fakeUser = null;
    testHelpers.clearDb(done);
  });
});
