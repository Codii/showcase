var chai = require('chai'),
  expect = chai.expect,
  _ = require('lodash'),
  request = require('supertest'),
  testHelpers = require('../helpers'),
  server = testHelpers.getServer(),
  UserModel = require('../../app/models/user').model;

describe('Users', function() {
  var fakeUserData = {
      firstName : 'Pablo',
      lastName  : 'Escobar',
      name      : 'pablo',
      email     : 'pablo.escobar@yopmail.com',
      password  : 'imInLoveWithTheCoca'
    },
    registeredUserData = {
      firstName : 'John',
      lastName  : 'Fullofshit',
      name      : 'johnfull',
      email     : 'john.fullof@yopmail.com',
      password  : '#imfullofshit'
    },
    fakeUser;

  beforeEach(function(done) {
    UserModel.create(registeredUserData, done);
  })

  describe('#create', function() {
    it('should create user with fake data', function(done) {
      request(server)
        .post('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(fakeUserData)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          done();
        });
    })
  });

  describe('#login', function() {
    it('should log in registered user', function(done) {
      request(server)
        .post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
          email    : registeredUserData.email,
          password : registeredUserData.password
        })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body.authToken).to.be.ok;
          done();
        });
    });

    it('should log in registered user', function(done) {
      request(server)
        .post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
          email    : 'unknown@yopmail.fr',
          password : ''
        })
        .end(function(err, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  afterEach(function(done) {
    fakeUser = null;
    testHelpers.clearDb(done);
  });
});
