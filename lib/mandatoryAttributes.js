/**
 * Holds the mandatory attributes for all events.
 */

var utils = require('./utils.js');
var mandatoryAttributes = {};

exports.init = function(config) {
    if (config && config.mandatoryAttributes) {
        mandatoryAttributes = config.mandatoryAttributes;
    } else {
        mandatoryAttributes = {};
    }
}

exports.get = function() {
    return mandatoryAttributes;
}
