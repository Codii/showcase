var chai = require('chai'),
  expect = chai.expect,
  _ = require('lodash'),
  mongoose = require('mongoose'),
  request = require('supertest'),
  testHelpers = require('../helpers'),
  server = testHelpers.getServer(),
  UserModel = require('../../app/models/user').model;

describe('Users', function() {
  var fakeUserData = {
      firstName : 'Pablo',
      lastName  : 'Escobar',
      email     : 'pablo.escobar@yopmail.com',
      name      : 'pablo',
      password  : 'imInLoveWithTheCoca'
    },
    registeredUserData = {
      firstName : 'John',
      lastName  : 'Fullofshit',
      name      : 'johnfull',
      email     : 'john@yopmail.com',
      password  : '#imfullofshit'
    },
    registredUser;

  beforeEach(function(done) {
    registredUser = new UserModel(registeredUserData);
    registredUser.save().then(function(user) {
      done();
    }, done);
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
    });

    it('should not create user without required payload', function(done) {
      request(server)
        .post('/users')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send()
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          done();
        });
    });

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

    it('should not log in unknown user', function(done) {
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
    testHelpers.clearDb(done);
  });
});
