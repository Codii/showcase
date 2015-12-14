var chai = require('chai'),
  expect = chai.expect,
  mongoose = require('mongoose'),
  helpers = require('../../helpers'),
  modelTimestampsPlugin = require('../../../app/models/plugins/timestamps'),
  junkModelSchema = new mongoose.Schema({
    message : { type : 'String' }
  }),
  JunkModel,
  token;

describe('Models Timestamps plugin', function() {

  beforeEach(function(done) {
    junkModelSchema.plugin(modelTimestampsPlugin);

    JunkModel = mongoose.model('JunkModel', junkModelSchema);

    token = new JunkModel();
    token.save()
      .then(function(savedToken) {
        done();
      }, done);
  });

  it('should have set token with a valid createdAt equal to modifiedAt', function(done) {
    expect(token.createdAt).to.be.ok;
    expect(token.createdAt).to.equal(token.modifiedAt);
    done();
  });

  it('should update token modifiedAt when saving', function(done) {
    token.message = 'Hello !';
    token.save()
      .then(function(savedToken) {
        expect(savedToken).to.be.ok;
        expect(savedToken.createdAt < savedToken.modifiedAt).to.be.true;
        done();
      }, done);
  });

  afterEach(function(done) {
    token = null;
    helpers.clearDb(function() {
      JunkModel.remove({}, done);
    });
  });
});
