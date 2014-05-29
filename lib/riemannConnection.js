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
var settings = { initialReconnectTimeoutMS: 1000, //The initial time-gap for the reconnectTimeout

    reconnectLimitMS : 10000,        //The max limit for the reconnectTimeout
    keepAliveIntervalMS : 60000};     //The time-gap between each keepAlive message sending

var keepAlive, reconnectTimeoutMS = settings.initialReconnectTimeoutMS;
exports.riemannClient = {};


//A method to create and configure the riemann-client
exports.connectToRiemann = function(config) {
    exports.riemannClient = riemann.createClient({
        host: config.host,
        port: config.port});

    exports.riemannClient.on('connect', function () {
        reconnectTimeoutMS = 1000;
        keepRiemannAlive();
    });

    exports.riemannClient.on('error', function (er) {
        if (er.code === 'ECONNREFUSED') {
            // Riemann was not started yet. Reconnect using exponential backoff
            reconnectTimeoutMS = (reconnectTimeoutMS * 2 < settings.reconnectLimitMS ? reconnectTimeoutMS * 2 : settings.reconnectLimitMS);
            setTimeout(function () {
                connectToRiemann(config);
            }, reconnectTimeoutMS);
        }
        else if (er.code === "EPIPE") {
            //Riemann disconnected unexpectedly (either temporal network issue, or riemann failed. Reconnect.
            clearInterval(keepAlive);
            connectToRiemann(config);
        }
    });
}


//a method that sends keep-alive messages to riemann on a regular basis, and reconnects to riemann in case it crashes
function keepRiemannAlive () {
    keepAlive = setInterval(function() {
        exports.riemannClient.send(exports.riemannClient.Event({ description: 'keepAlive',
            tags: ['georg', 'keepAlive']
        }), exports.riemannClient.tcp);

    }, settings.keepAliveIntervalMS);
};