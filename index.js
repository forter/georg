var exceptions = require('./lib/exceptions.js'),
    latencies = require('./lib/latencies.js'),
    connection = require('./lib/riemannConnection.js');



///This method should be called once, at one point in the code, after require('georg');
///It receives a configuration object, containing the riemann server details (IP, port) and boolean feature variables.
exports.init = function(config) {
    //Connect To Riemann
    connection.connectToRiemann(config);

    //Call the starter methods for each feature in the feature array
    //and export all needed functions for each feature
    if (config.exceptions) {
        exceptions.catchExceptions(config.service);
    }
    if (config.latencies) {
        exports.recordLatency = latencies.recordLatency;
    }
};
