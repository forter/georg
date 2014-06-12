var exceptions = require('./lib/exceptions.js'),
    latencies = require('./lib/latencies.js'),
    connection = require('./lib/riemannConnection.js');


///This method should be called once, at one point in the code, after require('georg');
///featureList is an array of strings, each representing a feature, i.e. - ['exceptions', 'latencies'].
///config is a configuration object for the riemann connection, i.e. - {host: '127.0.0.1', port: 5555, service: 'brainA'}.
exports.init = function(featureArray, config) {
    //CONNECT TO RIEMANN
    connection.connectToRiemann(config);

    //Call the starter methods for each feature in the feature array
    //and export all needed functions for each feature
    //TODO: FIND A BETTER WAY TO DO THIS, PERHAPS USING A MAP{string, function}
    if (featureArray.indexOf('exceptions') > -1) {
        exceptions.catchExceptions(config.service);
    }
    if (featureArray.indexOf('latencies') > -1) {
        exports.recordLatency = latencies.recordLatency;
    }
};



/*TODO: THE MAP(string, function) code will look like this -
 var a = {};
 a["exceptions"] = function() { console.log("EXCEPTIONS")};
 a["latencies"] = function() { console.log("LATENCIES")};

 var flist = ['exceptions', 'latencies'];

 for(var f in flist)
 a[flist[f]]();
 */