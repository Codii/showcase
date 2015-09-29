var chai = require('chai'),
  expect = chai.expect,
  Strategy = require('../../config/passport/tokenStrategy');


describe('Strategy', function() {

  describe('passing request to verify callback', function() {
    var strategy = new Strategy({ passReqToCallback: true }, function(req, token, done) {
      if (token == 'vF9dft4qmT') {
        return done(null, { id: '1234' }, { scope: 'read', foo: req.headers['x-foo'] });
      }
      return done(null, false);
    });

    describe('handling a request with valid token', function() {
      var user
        , info;

      before(function(done) {
        chai.passport.use(strategy)
          .success(function(u, i) {
            user = u;
            info = i;
            done();
          })
          .req(function(req) {
            req.headers.authorization = 'Bearer vF9dft4qmT';
            req.headers['x-foo'] = 'hello';
          })
          .authenticate();
      });

      it('should supply user', function() {
        expect(user).to.be.an.object;
        expect(user.id).to.equal('1234');
      });

      it('should supply info', function() {
        expect(info).to.be.an.object;
        expect(info.scope).to.equal('read');
      });

      it('should supply request header in info', function() {
        expect(info.foo).to.equal('hello');
      });
    });

    describe('handling a request with valid token in form-encoded body parameter', function() {
      var user
        , info;

      before(function(done) {
        chai.passport.use(strategy)
          .success(function(u, i) {
            user = u;
            info = i;
            done();
          })
          .req(function(req) {
            req.body = {};
            req.body.access_token = 'vF9dft4qmT';
          })
          .authenticate();
      });

      it('should supply user', function() {
        expect(user).to.be.an.object;
        expect(user.id).to.equal('1234');
      });

      it('should supply info', function() {
        expect(info).to.be.an.object;
        expect(info.scope).to.equal('read');
      });
    });

    describe('handling a request with valid credential in URI query parameter', function() {
      var user
        , info;

      before(function(done) {
        chai.passport.use(strategy)
          .success(function(u, i) {
            user = u;
            info = i;
            done();
          })
          .req(function(req) {
            req.query = {};
            req.query.access_token = 'vF9dft4qmT';
          })
          .authenticate();
      });

      it('should supply user', function() {
        expect(user).to.be.an.object;
        expect(user.id).to.equal('1234');
      });

      it('should supply info', function() {
        expect(info).to.be.an.object;
        expect(info.scope).to.equal('read');
      });
    });

    describe('handling a request with wrong token in header', function() {
      var challenge;

      before(function(done) {
        chai.passport.use(strategy)
          .fail(function(c) {
            challenge = c;
            done();
          })
          .req(function(req) {
            req.headers.authorization = 'Bearer WRONG';
          })
          .authenticate();
      });

      it('should fail with challenge', function() {
        expect(challenge).to.be.a.string;
        expect(challenge).to.equal('Bearer realm="Users", error="invalid_token"');
      });
    });

    describe('handling a request without credentials', function() {
      var challenge;

      before(function(done) {
        chai.passport.use(strategy)
          .fail(function(c) {
            challenge = c;
            done();
          })
          .req(function(req) {
          })
          .authenticate();
      });

      it('should fail with challenge', function() {
        expect(challenge).to.be.a.string;
        expect(challenge).to.equal('Bearer realm="Users"');
      });
    });
  });

  describe('failing a request with message string', function() {
    var strategy = new Strategy(function(token, done) {
      if (token == 'vF9dft4qmT') {
        return done(null, { id: '1234' }, { scope: 'read' });
      }
      return done(null, false, 'The access token expired');
    });

    describe('handling a request with wrong token', function() {
      var challenge;

      before(function(done) {
        chai.passport.use(strategy)
          .fail(function(c) {
            challenge = c;
            done();
          })
          .req(function(req) {
            req.headers.authorization = 'Bearer WRONG';
          })
          .authenticate();
      });

      it('should fail with challenge', function() {
        expect(challenge).to.be.a.string;
        expect(challenge).to.equal('Bearer realm="Users", error="invalid_token", error_description="The access token expired"');
      });
    });
  });

  describe('failing a request with hash containing message', function() {
    var strategy = new Strategy(function(token, done) {
      if (token == 'vF9dft4qmT') {
        return done(null, { id: '1234' }, { scope: 'read' });
      }
      return done(null, false, { message: 'The access token expired' });
    });

    describe('handling a request with wrong token', function() {
      var challenge;

      before(function(done) {
        chai.passport.use(strategy)
          .fail(function(c) {
            challenge = c;
            done();
          })
          .req(function(req) {
            req.headers.authorization = 'Bearer WRONG';
          })
          .authenticate();
      });

      it('should fail with challenge', function() {
        expect(challenge).to.be.a.string;
        expect(challenge).to.equal('Bearer realm="Users", error="invalid_token", error_description="The access token expired"');
      });
    });
  });

});
