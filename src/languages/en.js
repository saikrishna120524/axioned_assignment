// English
let enDict = {
    "TOKEN-EXPIRED": "Token expired",
    "TOKEN_NOT_GIVEN": "Bearer token not given for authenticate",
    "REQUIRED_FIELDS_ARE_MISSING": "Required fields are missing",

    "LOGIN_SUCCES": "Logged in successfully",
    "INVALID-CREDENTIALS": "Invalid username or password",
    "LOGIN_FAILED": "Login failed ",
    "NOT-AUTHORIZED": "Not authorised",

    "SUCCESS": "Success",
    "FAILED": "Failed"

};

exports.getValue = (key) => {
    return enDict[key] || key;
};