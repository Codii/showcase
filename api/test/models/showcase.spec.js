var chai = require('chai'),
  expect = chai.expect,
  helpers = require('../helpers'),
  showcase = require('../../app/models/showcase'),
  user = require('../../app/models/user'),
  ShowcaseModel = showcase.model,
  UserModel = user.model;

describe('Showcases', function() {
  var userEmail = 'fake@yopmail.com',
    userData = {
      email    : userEmail,
      name     : 'bob',
      password : 'mynameisbobbut..hushh'
    },
    showcaseData = {
      name : 'veggie.girl17'
    },
    user,
    showcase;

  beforeEach(function(done) {
    user = new UserModel(userData);
    showcase = new ShowcaseModel(showcaseData);

    user.save().then(function(user) {
      showcase.creator = user.id;
      return showcase.save().then(function() {
        done();
      });
    }, done);
  });

  it('should not let two showcases use the same name', function(done) {
    var otherShowcase = { name : showcaseData.name };

    ShowcaseModel.create(otherShowcase, function(err, showcase) {
      expect(err).to.be.ok;
      expect(showcase).to.not.be.ok;
      done();
    });
  });

  afterEach(function(done) {
    user = null;
    showcase = null;

    helpers.clearDb(done);
  });
});
