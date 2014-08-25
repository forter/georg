var exceptions = require('./lib/exceptions.js'),
    latencies = require('./lib/latencies.js'),
    connection = require('./lib/riemannConnection.js'),
    suppress = require('./lib/suppress.js'),
    events = require('./lib/events.js');


///This method should be called once, at one point in the code, after require('georg');
///It receives a configuration object, containing the riemann server details (IP, port) and feature JSONs.
exports.init = function(config) {
    //Connect To Riemann
    connection.connectToRiemann(config);

    //Call the starter methods for each feature in the feature array
    //and export all needed functions for each feature
    if (!!config.exceptions) {
        exports.Suppressor = suppress.Suppressor;
        exceptions.catchExceptions(config.exceptions, config.service);
    }
    if (config.latencies) {
        latencies.servicePrefix = config.service;
        exports.startLatency = latencies.startLatency;
        exports.endLatency = latencies.endLatency;
    }

    events.setMachineName(config.service);
    exports.sendEvent = events.sendEvent;
};


