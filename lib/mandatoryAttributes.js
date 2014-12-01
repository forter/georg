/**
 * Holds the mandatory attributes for all events.
 */

var utils = require('./utils.js');
var mandatoryAttributes = {};

exports.init = function(attributesToSet) {
    if (attributesToSet) {
        mandatoryAttributes = attributesToSet;
    } else {
        mandatoryAttributes = {};
    }
}

exports.get = function() {
    return mandatoryAttributes;
}
