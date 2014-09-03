

exports.customAttributesToRiemannFormat = function(customAttributes) {
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