
var mandatoryAttributes = require('./mandatoryAttributes')

/**
 * Add mandatory attributes to the given custom attributes and return all attributes in riemann format.
 * @param customAttributes
 */
function getAllAttributesRiemannFormat(customAttributes) {
    return convertToRiemannFormat(joinObjects(customAttributes, mandatoryAttributes.get()));
}

function customAttributesToRiemannFormat(customAttributes) {
    if (customAttributes && typeof customAttributes == "object") {
        return convertToRiemannFormat(customAttributes);
    } else {
        return [];
    }
}

/**
 * @returns {object} object containing all attributes of obj1 and all attributes of obj2.
 */
function joinObjects(obj1, obj2) {
    var result = {};
    copyAttributes(result, obj1);
    copyAttributes(result, obj2);
    return result;
}

function copyAttributes(destObj, srcObj) {
    for (var attrname in srcObj) {
        destObj[attrname] = srcObj[attrname];
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
exports.joinObjects = joinObjects; //export for tests

