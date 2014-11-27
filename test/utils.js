
var utils = require('../lib/utils.js');
var chai = require('chai');
var should = chai.should();
chai.use(require('chai-fuzzy'));

describe('Check convert json to riemann format', function() {
    it('for json should return list of key value pairs', function() {
        utils.customAttributesToRiemannFormat({"foo": "bar", "baz": 2}).should.deep.
            include.members([{key: 'foo', value: 'bar'}, {key: 'baz', value: 2}]);
    })

    it('for non object or empty object should return empty list', function () {
        utils.customAttributesToRiemannFormat("a").should.be.empty;
        utils.customAttributesToRiemannFormat().should.be.empty;
        utils.customAttributesToRiemannFormat({}).should.be.empty;
    })
})


describe('Check join objects', function() {
    it('Should return objects containing all attributes of both of the inputs', function() {
        utils.joinObjects({"foo": "bar"}, {"baz": 1}).should.be.jsonOf({"foo": "bar", "baz": 1});
        utils.joinObjects({}, {}).should.be.jsonOf({});
        utils.joinObjects({"foo": "bar"}, {}).should.be.jsonOf({"foo": "bar"});
        utils.joinObjects({}, {"baz": 1}).should.be.jsonOf({"baz": 1});
    })

    it('should not change original onjects', function() {
        var obj1 = {"foo": "bar", "baz": 1};
        var obj2 = {"bar": 2};
        utils.joinObjects(obj1, obj2);
        obj1.should.be.jsonOf({"foo": "bar", "baz": 1});
        obj2.should.be.jsonOf({"bar": 2});
    })
})
