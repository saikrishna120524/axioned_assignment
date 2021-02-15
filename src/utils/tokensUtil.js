'use strict';
const commons = require('./commons');
const enums = require('./enums');
const jwt = require('jsonwebtoken');
const moment = require('moment')
class tokensUtil {
    async generateAuthTokens(uId) {
        try {

            let tokens = {};
            let type = enums.tokenTypes.ACCESS
            let jwtPayload = {
                'sub': uId,
                'iat': commons.currentTimestamp(),
                'exp': (process.env.JWT_ACCESS_EXPIRATION_MINUTES * 60) + commons.currentTimestamp(), //moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes'),
                type,
            };
            let jwtOptions = {
                algorithm: 'HS512',
            }
            tokens['access'] = {
                'token': jwt.sign(jwtPayload, Buffer.from(process.env.JWT_SECRET, 'base64'), jwtOptions),
                'expires': jwtPayload.exp //new Date(jwtPayload.exp)
            }

            type = enums.tokenTypes.REFRESH;
            jwtPayload = {
                'sub': uId,
                'iat': commons.currentTimestamp(),
                'exp': (process.env.JWT_REFRESH_EXPIRATION_DAYS * 24 * 60 * 60) + commons.currentTimestamp(), //moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days'),
                type,
            };
            tokens['refresh'] = {
                'token': jwt.sign(jwtPayload, Buffer.from(process.env.JWT_SECRET, 'base64'), jwtOptions),
                'expires': jwtPayload.exp //new Date(jwtPayload.exp)
            }
            return Promise.resolve(tokens)
        } catch (error) {
            console.log("Error : ", error);
            return Promise.reject(error)
        }
    }
}
module.exports = new tokensUtil();