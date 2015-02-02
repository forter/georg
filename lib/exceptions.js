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

var riemannConnection = require('./riemannConnection.js'),
    suppress = require('./suppress.js'),
    utils = require('./utils.js');

var settings = { killTimeoutMS : 500 //The timeout for process-kill after an exception is caught
};
exports.servicePrefix = "";


var errorToMessage = function(error) {
    if (!error) {
        return "Error object is undefined";
    }

    if (error.stack) {
        return error.stack;
    } else {
        return JSON.stringify(error);
    }
}

///The method that starts the exception catching.
///Receives a configuration object: { host: riemannIP, port: riemannPort, service: serviceName }
exports.catchExceptions = function(config) {
    if(!!config.killTimeoutMS)
        settings.killTimeoutMS = config.killTimeoutMS;

    if(!config.suppressor)
        config.suppressor = function(ex) {
            return new suppress.Suppressor();
        };

    var callback = function() {
        //TODO: IMPLEMENT THIS FUNCTION TO SIGNAL THAT THE LOGGING IS OVER
    };

    process.on('uncaughtException', function(ex) {
        var suppressInfo = config.suppressor(ex);

        if (!suppressInfo.flags.suppressLog) {
            if (!!config.logger) {
                config.logger(ex, callback);
            } else {
                process.stderr.write(ex.stack, callback);
            }
        }

        if (!suppressInfo.flags.suppressExit) {
            setTimeout(function () {
                process.exit(2);
            }, settings.killTimeoutMS);
        }

        if(!suppressInfo.flags.suppressRiemann) {
            riemannConnection.sendEvent({
                description: ex.stack,
                service: exports.servicePrefix + ' : fatal-exception' + (!!ex.code ? " : " + ex.code : ""),
                tags: ['georg', 'fatal-exception'],
                attributes: utils.getAllAttributesRiemannFormat({})
            });
        }
    });
};



/**
 * Send alert about an unexpected exception (this exception is caught somewhere and doesn't crash the process, and
 * therefor different from "uncaught exception".
 * @param exception the exception.
 */
exports.sendUnexpectedException = function(exception, customAttributes) {
    var standardParams = {
        description: errorToMessage(exception),
        service: exports.servicePrefix + ' : exception' + (!!exception.code ? " : " + exception.code : ""),
        tags: ['georg', 'exception']};
    riemannConnection.sendEvent(standardParams, customAttributes);
}
