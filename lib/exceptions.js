/*******************************************************************************
* Copyright (c) 2014 Risk Academi Ltd. All rights reserved
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*******************************************************************************/
var riemann = require('riemann');
var settings = { reconnectTimeoutMS : 1000, reconnectLimitMS : 10000, killTimeoutMS : 500, keepAliveTimeoutMS : 60000};

var riemannClient, keepAlive;

//A method to create and configure the riemann-client
function connectToRiemann(config) {
        riemannClient = riemann.createClient({
            host: config.host,
            port: config.port});

        riemannClient.on('connect', function () {
// By convention the code cannot change the settings, since it was injected by devops. 
// Use a different variable to denote the current reconnectTimeout.
            settings.reconnectTimeoutMS = 1000;
            keepRiemannAlive();
        });

        riemannClient.on('error', function (er) {
            if (er.code === 'ECONNREFUSED') { 
                // Riemann was not started yet. Reconnect using exponential backoff
                settings.reconnectTimeoutMS = (settings.reconnectTimeoutMS * 2 < settings.reconnectLimitMS ? settings.reconnectTimeoutMS * 2 : settings.reconnectLimitMS);
                setTimeout(function () {
                    connectToRiemann(config);
                }, settings.reconnectTimeoutMS);
            }
            else if (er.code === "EPIPE") {
                //Riemann disconnected unexpectedly (either temporal network issue, or riemann failed. Reconnect.
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

    }, settings.keepAliveTimeoutMS); //TODO: Consider renaming to keepAliveIntervalMS
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
