var chai = require('chai'),
  expect = chai.expect,
  helpers = require('../helpers'),
  _ = require('lodash'),
  payloadShield = require('../../app/shield/payload');

describe('Shield', function() {

  describe('Payload', function() {

    var fakePayload = {
      name        : 'sully.morvan',
      firstName   : 'Sully',
      lastName    : 'Morval',
      email       : 'sully.morvan@yopmail.com',
      age         : 29,
      nationality : 'fr'
    };

    it('should restrict our given payload to the list of wandted fields', function(done) {
      var requiredFields = ['name', 'age', 'nationality'],
        result = payloadShield.restrict(fakePayload, requiredFields);

      expect(result).to.be.ok;
      expect(_.keys(result).length).to.equal(requiredFields.length);
      done();
    });

    it('should not accept the payload as it is not complete', function(done) {
      var requiredFields = ['name', 'caca', 'nationality'],
        result = payloadShield.restrict(fakePayload, requiredFields);

      expect(result).not.to.be.ok;
      done();
    });

  });
});
