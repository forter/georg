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
var utils = require('./utils.js');
var exceptions = require('./exceptions.js');
var _ = require('underscore');

exports.servicePrefix = "";

exports.startLatency = function(service) {
    return {
        start: Date.now(),
	    service: exports.servicePrefix + " " + service + ".",
	    checkpoints: {}
   };
}

exports.checkpointLatency = function(latencyObj, customAttributeName) {
  latencyObj.checkpoints[customAttributeName] = Date.now() - latencyObj.start;
};

exports.endLatency = function(latencyObj, error, customAttributes, customTags) {
    var latency = Date.now() - latencyObj.start;
    var isoDate = (new Date(latencyObj.start)).toISOString();
    var attributes = _.extend(latencyObj.checkpoints, customAttributes, {"startTime": isoDate});
    var tags = ['georg', 'latency'];
    if (!!customTags && (customTags.length > 0)) {
        tags = tags.concat(customTags);
    }
    var standardParams = {
        description: "service latency recording. " + (!!error ? "Error: "+error.stack : ""),
        metric: latency,
        service: latencyObj.service,
        state: (!!error ? "failure" : "success"),
        tags: tags,
        attributes: attributes
    };
    riemannConnection.sendEvent(standardParams, attributes);
    if (!! error) {
      exceptions.sendUnexpectedException(error, undefined, latencyObj.service);
    }
    return latency;
};
