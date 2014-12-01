
var mandatoryAttributes = require('./mandatoryAttributes')
var _ = require('underscore');

/**
 * Add mandatory attributes to the given custom attributes and return all attributes in riemann format.
 * @param customAttributes
 */
function getAllAttributesRiemannFormat(customAttributes) {
    var allAttributes = _.extend({}, customAttributes, mandatoryAttributes.get())
    return convertToRiemannFormat(allAttributes);
}

function customAttributesToRiemannFormat(customAttributes) {
    if (customAttributes && typeof customAttributes == "object") {
        return convertToRiemannFormat(customAttributes);
    } else {
        return [];
    }
}

function convertToRiemannFormat(json) {
    var lst = [];
    Object.keys(json).forEach(function(attrKey) {
        lst.push({key: attrKey, value: json[attrKey]});
    })
    return lst;
}


exports.getAllAttributesRiemannFormat = getAllAttributesRiemannFormat;
exports.customAttributesToRiemannFormat = customAttributesToRiemannFormat; //export for tests

