const datetime = require('node-datetime');

class Common {
    /* Returns the current unix timestamp */
    currentTimestamp() {
        return datetime.create().epoch();
    };

    getDateTime() {
        return datetime.create().now();
    };

}

exports = module.exports = new Common();