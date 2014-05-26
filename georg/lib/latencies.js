/*** Created by yaniv on 15/05/14.***/

var riemann = require('riemann');
var riemannClient;

exports.LatencyRecorder = function(config) {
    riemannClient = riemann.createClient({
        host: config.host,
        port: config.port });

    riemannClient.on('data', function(ack) {
        console.log("SENT");
    });
};


exports.recordLatency = function(serviceConfig) {
    riemannClient.send(riemannClient.Event({service: "HELLO"}), riemannClient.tcp);
};