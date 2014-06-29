if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([], function() {
    var exceptions = require('./lib/exceptions.js'),
        latencies = require('./lib/latencies.js'),
        connection = require('./lib/riemannConnection.js');

    var exportsObj = {init : init};

    ///This method should be called once, at one point in the code, after require('georg');
    ///It receives a configuration object, containing the riemann server details (IP, port) and boolean feature variables.
    function init(config) {
        //Connect To Riemann
        connection.connectToRiemann(config);

        //Call the starter methods for each feature in the feature array
        //and export all needed functions for each feature
        if (config.exceptions) {
            exceptions.catchExceptions(config.service);
        }
        if (config.latencies) {
            exportsObj.startLatency = latencies.startLatency;
            exportsObj.endLatency = latencies.endLatency;
        }
    };

    return exportsObj;
});