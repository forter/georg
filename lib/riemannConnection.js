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
    keepAliveIntervalMS : 60000,     //The time-gap between each keepAlive message sending
    reconnectMaximumRetries: -1 };   //The maxmimum reconnect retries, default -1 which means no limit

var keepAlive, reconnectTimeoutMS = settings.initialReconnectTimeoutMS, reconnectRetry = 0;
var riemannClient = {};
var _ = require('underscore');
var utils = require('./utils');

var ipAddress = require('ip').address();
var retryConnecting = 0;

//A method to create and configure the riemann-client
function connectToRiemann(config) {
    var reconnectMaximumRetries = config.reconnectMaximumRetries || settings.reconnectMaximumRetries,
        reconnectTimeoutMS = 0;

    riemannClient = riemann.createClient({
        host: config.host,
        port: config.port});

    riemannClient.on('connect', function () {
        reconnectRetry = 0;
        keepRiemannAlive();
    });

    riemannClient.on('error', function (er) {
        //Riemann disconnected unexpectedly (either temporal network issue, or riemann failed. Reconnect.
        clearInterval(keepAlive);

        reconnectRetry++;
        // Riemann was not started yet. Reconnect using better exponential backoff
        // Random ms for distributed riemann client
        reconnectTimeoutMS = Math.round(Math.random()*500) * Math.pow(2,reconnectRetry);

        if (reconnectRetry <= reconnectMaximumRetries || reconnectMaximumRetries === -1) {
            setTimeout(function () {
                connectToRiemann(config);
            }, reconnectTimeoutMS);
        } else {
            throw new Error('exceeded numbers connection retries riemann ('+reconnectRetry+' retries)');
        }
    });
}


//a method that sends keep-alive messages to riemann on a regular basis, and reconnects to riemann in case it crashes
function keepRiemannAlive () {
    // avoid leaking of timers
    clearInterval(keepAlive);
    keepAlive = setInterval(function() {
        sendEvent({ description: 'keepAlive', tags: ['georg', 'keepAlive']});
    }, settings.keepAliveIntervalMS);
};

/**
 * Create event and send it to Riemann.
 * @param params ({}) event parameters like expected by node riemann client when creating an event -
 * riemannClient.Event.
 */
function sendEvent(standardFields, customAttributes) {
    var eventParams = standardFields;

    if (!eventParams.host) {
        eventParams.host = ipAddress;
    }

    eventParams.attributes = utils.getAllAttributesRiemannFormat(customAttributes);

    var event = riemannClient.Event(eventParams);
    riemannClient.send(event, riemannClient.tcp);

}


exports.connectToRiemann = connectToRiemann;
exports.sendEvent = sendEvent;
