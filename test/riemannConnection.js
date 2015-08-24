
var riemannConnection = require('../lib/riemannConnection');
var georg = require('../../georg');
var chai = require('chai');
var should = chai.should();

describe('Test maximum reconnect retries', function() {
    this.timeout(15000);

    it('Should throw exception after retries limit exceeded', function(done) {
        georg.init({
            host: '127.0.0.1',
            port: 5555,
            reconnectMaximumRetries: 2,
            exceptions: {
                killTimeoutMS: 1000,
                //optional logger for integration with winston logging framework
                logger: function (err, callback) {
                    err.message.should.equal('exceeded numbers connection retries riemann (2 retries)');
                    done();
                },
                suppressor: function (ex) {
                    return new georg.Suppressor().suppressExit();
                }
            }
        })
    });
});

describe('Test for maximum delay of a reconnection retry time', function() {
    var reconnectTimeoutMS = 0, maxRetryDelayMS = 10001;

    it('1. first attempt suppose to be lower then 1000', function() {
        reconnectTimeoutMS = riemannConnection.getReconnectTimeoutMS(reconnectTimeoutMS, 1, maxRetryDelayMS-1);
        reconnectTimeoutMS.should.equal(0);
    });


    it('2. second attempt suppose to be lower then 1000', function() {
        reconnectTimeoutMS = riemannConnection.getReconnectTimeoutMS(reconnectTimeoutMS, 2, maxRetryDelayMS-1);
        console.log(reconnectTimeoutMS);
        reconnectTimeoutMS.should.be.below(maxRetryDelayMS);
    });

    it('3. third attempt suppose to be lower then 1000', function() {
        reconnectTimeoutMS = riemannConnection.getReconnectTimeoutMS(reconnectTimeoutMS, 3, maxRetryDelayMS-1);
        console.log(reconnectTimeoutMS);
        reconnectTimeoutMS.should.be.below(maxRetryDelayMS);
    });


    it('4. fourth attempt suppose to be lower then 1000', function() {
        reconnectTimeoutMS = riemannConnection.getReconnectTimeoutMS(reconnectTimeoutMS, 4, maxRetryDelayMS-1);
        console.log(reconnectTimeoutMS);
        reconnectTimeoutMS.should.be.below(maxRetryDelayMS);
    });


    it('5. fifth attempt suppose to be lower then 1000', function() {
        reconnectTimeoutMS = riemannConnection.getReconnectTimeoutMS(reconnectTimeoutMS, 5, maxRetryDelayMS-1);
        console.log(reconnectTimeoutMS);
        reconnectTimeoutMS.should.be.below(maxRetryDelayMS);
    });

    it('6. sixth attempt suppose to be lower then 1000', function() {
        reconnectTimeoutMS = riemannConnection.getReconnectTimeoutMS(reconnectTimeoutMS, 6, maxRetryDelayMS-1);
        console.log(reconnectTimeoutMS);
        reconnectTimeoutMS.should.be.below(maxRetryDelayMS);
    });
})