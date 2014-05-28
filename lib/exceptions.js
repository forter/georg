/*** Created by yaniv on 13/05/14.***/

var riemann = require('riemann');
var settings = { reconnectTimeoutMS : 1000, reconnectLimitMS : 10000, killTimeoutMS : 500, keepAliveTimeoutMS : 60000};

var riemannClient, keepAlive;

//A method to create and configure the riemann-client
function connectToRiemann(config) {
        riemannClient = riemann.createClient({
            host: config.host,
            port: config.port});

        riemannClient.on('connect', function () {
            settings.reconnectTimeoutMS = 1000;
            keepRiemannAlive();
        });

        riemannClient.on('error', function (er) {
            if (er.code === 'ECONNREFUSED') { /*Riemann was down during georg-up*/
                settings.reconnectTimeoutMS = (settings.reconnectTimeoutMS * 2 < settings.reconnectLimitMS ? settings.reconnectTimeoutMS * 2 : settings.reconnectLimitMS);
                setTimeout(function () {
                    connectToRiemann(config);
                }, settings.reconnectTimeoutMS);
            }
            else if (er.code === "EPIPE") { /*Riemann crashed during working*/
                clearInterval(keepAlive);
                connectToRiemann(config);
            }
        });
}

//a method to log exceptions tow the console / logger
function logException(ex) {
    console.log('Uncaught Exception: ' + ex.message);
    //TODO: Use a logger here to log the exception somewhere else
};

//a method that sends keep-alive messages to riemann on a regular basis, and reconnects to riemann in case it crashes
function keepRiemannAlive () {
    keepAlive = setInterval(function() {
            riemannClient.send(riemannClient.Event({ description: 'keepAlive',
                tags: ['georg', 'keepAlive']
            }), riemannClient.tcp);

    }, settings.keepAliveTimeoutMS);
};

///The method that starts the exception catching.
///Receives a configuration object, which contains riemann's IP, riemann's port and the service name.
exports.exceptionCatcher = function(config) {
    connectToRiemann(config);

    process.on('uncaughtException', function(ex) {
        setTimeout(function() {
            process.exit(2);
         }, settings.killTimeoutMS);
        riemannClient.send(riemannClient.Event({  description: ex.message,
                                                  service: config.service,
                                                  tags: ['georg', 'uncaught-exception']
                                                  }), riemannClient.tcp);

        logException(ex);
    });
};
