var exceptions = require('./lib/exceptions.js'),
    latencies = require('./lib/latencies.js'),
    connection = require('./lib/riemannConnection.js'),
    suppress = require('./lib/suppress.js'),
    events = require('./lib/events.js'),
    mandatoryAttributes = require('./lib/mandatoryAttributes');


///This method should be called once, at one point in the code, after require('georg');
///It receives a configuration object, containing the riemann server details (IP, port) and feature JSONs.
exports.init = function(config) {
    //Connect To Riemann
    connection.connectToRiemann(config);

    exceptions.servicePrefix = config.service;
    exports.sendUnexpectedException = exceptions.sendUnexpectedException;

    if (config.exceptions) {
        exports.Suppressor = suppress.Suppressor;
        exceptions.catchExceptions(config.exceptions);
    }

    if (config.latencies) {
        latencies.servicePrefix = config.service;
        exports.startLatency = latencies.startLatency;
        exports.checkpointLatency = latencies.checkpointLatency;
        exports.endLatency = latencies.endLatency;
    }

    if (config.mandatoryAttributes) {
        mandatoryAttributes.init(config.mandatoryAttributes);
    }

    events.setMachineName(config.service);
    exports.sendEvent = events.sendEvent;
};


