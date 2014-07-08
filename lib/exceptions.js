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

var settings = { killTimeoutMS : 500 //The timeout for process-kill after an exception is caught
};

///The method that starts the exception catching.
///Receives a configuration object: { host: riemannIP, port: riemannPort, service: serviceName }
exports.catchExceptions = function(config, serv) {
    if(!!config.killTimeoutMS)
        settings.killTimeoutMS = config.killTimeoutMS;


    var callback = function() {
        //TODO: IMPLEMENT THIS FUNCTION TO SIGNAL THAT THE LOGGING IS OVER
    };

    process.on('uncaughtException', function(ex) {
        if(!!config.logger)
            config.logger(ex, callback);
        else
            process.stderr.write(ex.stack, callback);

        setTimeout(function() {
            process.exit(2);
        }, settings.killTimeoutMS);

        riemannConnection.riemannClient.send(riemannConnection.riemannClient.Event({description: ex.stack,
                                             service: serv + ' : uncaught-exception' + (!!ex.code ? " : " + ex.code : ""),
                                             tags:['georg', 'uncaught-exception']}),
                                             riemannConnection.riemannClient.tcp);
    });
};