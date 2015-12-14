var chai = require('chai'),
  expect = chai.expect,
  helpers = require('../helpers'),
  showcase = require('../../app/models/showcase'),
  ShowcaseModel = showcase.model;

describe('Showcases', function() {
  var showcaseData = {
    name : 'veggie.girl17'
  };

  beforeEach(function(done) {
    ShowcaseModel.create(showcaseData, done);
  });

  it('should not let two showcases use the same name', function(done) {
    var otherShowcase = {
      name : showcaseData.name
    };

    ShowcaseModel.create(otherShowcase, function(err, showcase) {
      if (!err) {
        return done.fail();
      }

      expect(showcase).to.not.be.ok;
      done();
    });
  });

  afterEach(function(done) {
    helpers.clearDb(done);
  });
});
