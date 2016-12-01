/******************************************************************************
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
var machineName = '';

/**
 * @param service The name of the service all events will be sent from.
 */
exports.setMachineName = function(name) {
    machineName = name;
}

function createEventTags(customTags) {
    var eventTags = ['custom-event'];
    customTags = customTags ? customTags : [];
    return eventTags.concat(customTags);
}

/**
 * Send event to riemann.
 * @param eventParams parameters for the event, all optional:
 * - description {String} - general description of the event
 * - service {String} - the name of the service responsible for the event. Will be concatenated to the name.å
 * - metric {double} - the value for the sub service event (for example - in queue producer service this will be the
 * number of queues connected).
 * - state {String} - the state of the event (for example - in tests the states could be "failed" and "passed")
 * - tags {List<String>} tags for the event (the event will be filtered by these tags by Riemann to determine the
 * required action).
 * - customAttributes {object} json with key value custom attributes
 */
exports.sendEvent = function(eventParams) {
    var standardParams = {
        description: eventParams.description,
        service: machineName + " " + eventParams.service + ".",
        metric: eventParams.metric,
        state: eventParams.state,
        tags: createEventTags(eventParams.tags)
    }
        riemannConnection.sendEvent(standardParams, eventParams.customAttributes);
}


/*
     * Send events to Riemann for monitoring. This method wraps the sendEvent method, mostly for monitoring events
       directly related for merchants. It uses specific tags and attribute names so Kibana dashboards on the other end will (almost)
       automatically display new type of events we started monitoring.
       
     * @param [array] tagList:        tags of the record that will be inserted to ElasticSearch.
                                      tags help to find/filter record in ES. EXAMPLE: ["monitoring","omni_api"]
     * @param {object} values:        dict containing key-value pairs of the values the user wants to monitor
                                      for the given session
     * @param string sessionId
     * @param  string merchant
     * @param string  description:    short description of what we're monitoring.
                                      EXAMPLE: "track the count and rate of omni api calls"
     * @param string serviceName:     Name of service from which we're sending the event.
                                      For example - "brain.api omni"
     **/

exports.eventsMonitor = function(tagList,values,sessionId,merchant,description,serviceName){

       //add user tags (if exist) to the default monitoring tag
       if(tagList instanceof Array){
         tagList.push("monitoring");
       }
       else{
         tagList = ["monitoring"]
       }


       //fill the value_object with the values we want to monitor. Adding a prefix for the key so to filter easily in ES
       valueObject = {};
       valueObject['merchant'] = merchant;
       valueObject['sessionId']  = sessionId;
       if(typeof values === 'object'){
           for (key in values){
                valueObject['monitor_' + key] = values[key];
           }
        }

        if (typeof description !== 'string'){
            description = 'description was not entered correctly'
            };

        if(typeof serviceName !== 'string'){
            serviceName = 'service name was not entered correctly'
            };

        if (typeof sessionId !== 'string'){
            sessionId = 'sessionId was not entered correctly'
            };

        if(typeof merchant !== 'string'){
            merchant = 'merchant name was not entered correctly'
            };

      sendEvent({
        service: serviceName,
        description: description,
        customAttributes: valueObject,
        tags: tagList
      });
};



