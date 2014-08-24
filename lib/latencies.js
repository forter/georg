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

var riemannConnection = require('./riemannConnection.js');
exports.servicePrefix = "";

function createLatencyTags(customTags) {
    var latencyTags = ['georg', 'latency'];
    customTags = customTags ? customTags : [];
    return latencyTags.concat(customTags);
}

exports.startLatency = function(service, tags) {
    return {
        start: Date.now(),
        service: exports.servicePrefix + " " + service + "."
    };
}

exports.endLatency = function(latencyObj, error, tags) {
    var latency = Date.now() - latencyObj.start;

    var e = riemannConnection.riemannClient.Event({ description: "service latency recording. " + (!!error ? "Error: "+error.stack : ""),
        metric: latency,
        service: latencyObj.service,
        state: (!!error ? "failure" : "success"),
        tags: createLatencyTags(tags)});

    riemannConnection.riemannClient.send(e, riemannConnection.riemannClient.tcp);
}
