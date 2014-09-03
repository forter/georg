

exports.customAttributesToRiemannFormat = function(customAttributes) {
    if (customAttributes && typeof customAttributes == "object") {
        return convertToRiemannFormat(customAttributes);
    }
}

function convertToRiemannFormat(json) {
    var lst = [];
    Object.keys(json).forEach(function (key) {
        var keyValuePair = {};
        keyValuePair[key] = json[key];
        lst.push(keyValuePair);
    })
    return lst;
}