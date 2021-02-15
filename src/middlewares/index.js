const response = require('../lib/response');
const jwt = require('jsonwebtoken');
const commons = require('../utils/commons');
const mongoose = require('mongoose');

class Middleware {

    /** Authenticate JWT token
     * @param req
     * @param res
     * @param next
     */
    requireJWTAuthentication(req, res, next) {
        try {

            let decoded;
            let token = this.getToken(req.headers);

            if (token === null) {
                return response.error(response.buildError(401, 'TOKEN-NOT-GIVEN'), '', req, res);
            }
            decoded = jwt.verify(token, Buffer.from(process.env.JWT_SECRET, 'base64'), {
                algorithms: 'HS512'
            });
            if (decoded.exp < commons.currentTimestamp()) {
                return response.error(response.buildError(401, 'TOKEN-EXPIRED'), '', req, res);
            } else {
                req.uId = mongoose.Types.ObjectId(decoded.sub);
                return next();
            }

        } catch (err) {
            return response.error(response.buildError(401, 'NOT-AUTHORIZED'), err, req, res);
        }

    }

    methodNotAllowed(req, res) {
        let error = response.buildError(405, 'METHOD-NOT-ALLOWED');
        return response.error(error, '', req, res);
    }

    pageNotFound(req, res) {
        return response.error(response.buildError(404, 'PAGE-NOT-FOUND'),
            '', req, res);
    }

    /** Get token
     * @param headers
     */
    getToken(headers) {
        if (headers && headers.authorization) {
            let parted = headers.authorization.split(' ');

            //console.log(parted[1])
            if (parted.length === 2) {
                return parted[1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }


}

module.exports = new Middleware();