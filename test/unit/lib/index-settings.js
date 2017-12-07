var assert = require('assert');
var settings = require('../../../lib/settings')();

describe('settings', function() {

    it('load settings', function () {
        assert.notEqual(settings, null);
        assert.equal(settings.hasOwnProperty('neeo'), true);
        assert.equal(settings.hasOwnProperty('settings'), true);
        assert.equal(settings.hasOwnProperty('controllers'), true);
    });

});

describe('service', function() {
    
    it('initialise', function () {

    });

});

describe('service', function() {
    
    it('initialise', function () {

    });

});