
var utils = require('../lib/utils.js');
var mandatoryAttributes = require('../lib/mandatoryAttributes');
var chai = require('chai');
var should = chai.should();

describe('Check convert json to riemann format', function() {
    it('for json should return list of key value pairs', function() {
        utils.customAttributesToRiemannFormat({"foo": "bar", "baz": 2}).should.eql([{key: 'foo', value: 'bar'}, {key: 'baz', value: '2'}]);
    })

    it('for non object or empty object should return empty list', function () {
        utils.customAttributesToRiemannFormat("a").should.be.empty;
        utils.customAttributesToRiemannFormat().should.be.empty;
        utils.customAttributesToRiemannFormat({}).should.be.empty;
    })
})


describe('Test getAllAttributesRiemannFormat', function() {
    var mandatoryAttrs = {"foo": "bar", "baz": 2};

    it('should return given attributes + mandatory attributes in riemann format', function() {
        mandatoryAttributes.init(mandatoryAttrs);
        var customAttrs = {"att1": 1};
        var allAttrs = utils.getAllAttributesRiemannFormat(customAttrs);
        allAttrs.should.eql([{key: 'att1', value: "1"}, {key: 'foo', value: 'bar'}, {key: 'baz', value: "2"}]);
    })

    it('should return only mandatory attributes for empty json', function() {
        mandatoryAttributes.init(mandatoryAttrs);
        var allAttrs = utils.getAllAttributesRiemannFormat({});
        allAttrs.should.eql([{key: 'foo', value: 'bar'}, {key: 'baz', value: "2"}]);
    })
})
