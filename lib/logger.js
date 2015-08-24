

var callback = function() {
    //TODO: IMPLEMENT THIS FUNCTION TO SIGNAL THAT THE LOGGING IS OVER
};

/**
 * @returns {logger} true if logger is configured allow sending exceptions through logger method
 */
function isLoggerConfigured(config) {
    return config.logger;
}

/**
 * passing exceptions throught logger method of georg exceptions config
 */
function exceptionLogger(config, ex) {
    if (isLoggerConfigured(config)) {
        config.logger(ex, callback);
    }
}

exports.exceptionLogger = exceptionLogger;
exports.isLoggerConfigured = isLoggerConfigured;