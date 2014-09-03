/**
 * Created by anya on 9/3/14.
 */


var utils = require('../lib/utils.js');
var should = require('chai').should();

describe('Check convert json to riemann format', function() {
    it('for json should return list of key value pairs', function() {
        utils.customAttributesToRiemannFormat({"foo": "bar", "baz": 2}).should.deep.include.members([{'foo': 'bar'}, {'baz': 2}]);
    })

    it('for non object should return undefined', function () {
        should.not.exist(utils.customAttributesToRiemannFormat("a"))
        should.not.exist(utils.customAttributesToRiemannFormat())
    })
})