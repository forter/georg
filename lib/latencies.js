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
var riemannConnection = require('./riemannConnection.js');

///The method that starts the latency recording.
///Receives a configuration object: { host: riemannIP, port: riemannPort, service: serviceName }
exports.startRecorder = function(config) {
    riemannConnection.connectToRiemann(config);
    exports.recordLatency = recordLatency;
};


///The method that handles each service.
///Receives a configuration object: { name, latencyMS, type, completed}
function recordLatency(serviceInfo) {
    var e = riemannConnection.riemannClient.Event({ description: "service latency recording",
                                                    metric: serviceInfo.latencyMS,
                                                    service: serviceInfo.name + serviceInfo.type,
                                                    completed: serviceInfo.completed,
                                                    tags: ['georg', 'latency']});

    riemannConnection.riemannClient.send(e, riemannConnection.riemannClient.tcp);
};