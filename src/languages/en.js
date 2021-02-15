// English
let enDict = {
    "SUCCESS": "Success",
    "FAILED": "Failed"
};

exports.getValue = (key) => {
    return enDict[key] || key;
};