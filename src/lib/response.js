'use strict';
const languages = require('../languages/index');

class Response {
    /** Send success response
     * @param code
     * @param textMessage
     * @param data
     * @param req
     * @param res
     */
    send(code, textMessage, data, req, res) {
        let message = languages.getText(req.get('Accept-Language'), textMessage);
        let result = {
            'status': code,
            'message': message
        };

        if (data !== '') {
            result['data'] = data;
        }

        let resultString = JSON.stringify(result);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.status(code).end(resultString);
    };

    /** Send error response
     * @param err
     * @param defaultMessage
     * @param req
     * @param res
     */
    error(err, defaultMessage, req, res) {
        let level;
        let result;
        let message;

        try {
            level = 3;

            let error = JSON.parse(err.message);
            message = languages.getText(req.get('Accept-Language'), error.msg);

            result = {
                status: error.code,
                message: message,
                error: defaultMessage
            };
        } catch (r) {
            level = 2;

            message = languages.getText(req.get('Accept-Language'), defaultMessage);
            result = {
                status: 400,
                message: message
            };
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.status(result.status).end(JSON.stringify(result));

    };


    /** Forms the error object understandable to the error handler
     * @param errorCode
     * @param message
     */
    buildError(errorCode, message) {
        return new Error(JSON.stringify({
            'code': errorCode,
            'msg': message
        }));
    }

    /** Get the message from languages file
     * @param language
     * @param message
     */
    getMessage(language, message) {
        return languages.getText(language, message);
    }
}

let response = new Response();
exports = module.exports = response;