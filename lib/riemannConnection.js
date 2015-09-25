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
var settings = {
    initialReconnectTimeoutMS: 1000, //The initial time-gap for the reconnectTimeout
    reconnectLimitMS: 10000,        //The max limit for the reconnectTimeout
    keepAliveIntervalMS: 60000
};     //The time-gap between each keepAlive message sending

var keepAlive, reconnectTimeoutMS = settings.initialReconnectTimeoutMS;
var riemannClient = {};
var utils = require('./utils');

var ipAddress = require('ip').address();
var isConnected = false;

//A method to create and configure the riemann-client
function connectToRiemann(config) {
    riemannClient = riemann.createClient({
        host: config.host,
        port: config.port
    });

    riemannClient.on('connect', function () {
        isConnected = true;
        reconnectTimeoutMS = 1000;
        keepRiemannAlive();
    });

    riemannClient.on('disconnect', function () {
        isConnected = false;
        clearInterval(keepAlive);
    });

    riemannClient.on('error', function (er) {
        isConnected = false;
        if (er.code === 'ECONNREFUSED') {
            // Riemann was not started yet. Reconnect using exponential backoff
            reconnectTimeoutMS = (reconnectTimeoutMS * 2 < settings.reconnectLimitMS ? reconnectTimeoutMS * 2 : settings.reconnectLimitMS);
            setTimeout(function () {
                riemannClient.disconnect();
                connectToRiemann(config);
            }, reconnectTimeoutMS);
        }
        else {
            //Riemann disconnected unexpectedly (either temporal network issue, or riemann failed. Reconnect.
            riemannClient.disconnect();
            connectToRiemann(config);
        }
    });
}


//a method that sends keep-alive messages to riemann on a regular basis, and reconnects to riemann in case it crashes
function keepRiemannAlive() {
    keepAlive = setInterval(function () {
        sendEvent({description: 'keepAlive', tags: ['georg', 'keepAlive']});
    }, settings.keepAliveIntervalMS);
}

/**
 * Create event and send it to Riemann.
 * @param standardFields ({}) : event parameters like expected by node riemann client when creating an event -
 * riemannClient.Event.
 * @param customAttributes
 */
function sendEvent(standardFields, customAttributes) {
    if (isConnected) {
        var eventParams = standardFields;

        if (!eventParams.host) {
            eventParams.host = ipAddress;
        }

        eventParams.attributes = utils.getAllAttributesRiemannFormat(customAttributes);

        var event = riemannClient.Event(eventParams);
        riemannClient.send(event, riemannClient.tcp);
    }
    else {
        // console.log('Georg error: can\'t send event - not connected.');
    }
}


exports.connectToRiemann = connectToRiemann;
exports.sendEvent = sendEvent;
