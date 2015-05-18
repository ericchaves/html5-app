/*global describe,before,beforeEach,after,afterEach,it,xit, process */
var username = process.env.SAUCE_USERNAME || "SAUCE_USERNAME";
var accessKey = process.env.SAUCE_ACCESS_KEY || "SAUCE_ACCESS_KEY";

require('colors');
var wd = require('wd');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var _ = require('lodash');

chai.use(chaiAsPromised);
chai.should(); 
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var desired = [
  { browserName:'internet explorer', version: '8',  platform: 'XP' },
  { browserName:'chrome', platform: 'XP' },
  { browserName:'chrome', platform: 'LINUX' }
];

_.each(desired, function(target){ 

  describe('visit landing page ' + target.browserName , function() {
    this.timeout(30000);
    var browser;
    
    before(function(done){
      //browser = wd.promiseChainRemote("localhost", 4445, username, accessKey);
      browser = wd.promiseChainRemote('ondemand.saucelabs.com', 80, username, accessKey);
      var cap = _.merge({tags:['customer X'], name: 'visit landing page'}, target); 
      browser
        .init(cap)
      .get('http://localhost:3000')
      .nodeify(done);
    });
    
    after(function(done){
      browser.quit()
      .nodeify(done);
    });
  
    it('should have a title', function(done) {
      browser
      .title()
        .should.become('HTML5 App')
      .nodeify(done);
    });

    it('should have hello in a unit hero', function(done) {
      browser
      .elementByCssSelector('.hero-unit h1')
      .text()
        .should.become('Hello!')
      .nodeify(done);
    });
  
  });

});