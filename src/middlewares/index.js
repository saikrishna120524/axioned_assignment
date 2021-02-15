const response = require('../lib/response');

class Middleware {

    methodNotAllowed(req, res) {
        let error = response.buildError(405, 'METHOD-NOT-ALLOWED');
        return response.error(error, '', req, res);
    }

    pageNotFound(req, res) {
        return response.error(response.buildError(404, 'PAGE-NOT-FOUND'),
            '', req, res);
    }

}

module.exports = new Middleware();