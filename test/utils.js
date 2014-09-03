
var utils = require('../lib/utils.js');
var should = require('chai').should();

describe('Check convert json to riemann format', function() {
    it('for json should return list of key value pairs', function() {
        utils.customAttributesToRiemannFormat({"foo": "bar", "baz": 2}).should.deep.
            include.members([{key: 'foo', value: 'bar'}, {key: 'baz', value: 2}]);
    })

    it('for non object should return undefined', function () {
        utils.customAttributesToRiemannFormat("a").should.be.empty;
        utils.customAttributesToRiemannFormat().should.be.empty;
    })
})
