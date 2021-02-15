'use strict';
const Joi = require('joi');
const response = require('../lib/response');
const enums = require('../utils/enums');

const indexDao = require('../dao/indexDao');
const battles = require('../models/battles');

class BattlesController {

    /**
     * @swagger
     * paths:
     *   /list:
     *     get:
     *       summary: Fetch battles list
     *       description: Used for retrieving the details of an user
     *       tags: [Users]
     *       security:
     *       consumes:
     *         - application/json
     *       produces:
     *         - application/json
     *       responses:
     *         200:
     *            description: "Successfully retrieved"
     *         400:
     *            description: "Failed to retrieve"
     *         
     */
    async getBattlesList(req, res) {
        try {

            let result = await indexDao.find(battles, {}, {})
            if (result) {
                return response.send(200, "SUCCESS", result, req, res)
            } else {
                return response.error(response.buildError(400, "FAILURE"), '', req, res);
            }
        } catch (error) {
            console.log("Error: ", error)
            return response.error(response.buildError(400, "FAILURE"), error.message, req, res);
        }
    }

    /**
     * @swagger
     * paths:
     *   /count:
     *     get:
     *       summary: Fetch battles count
     *       description: Used for retrieving the details of an user
     *       tags: [Users]
     *       security:
     *       consumes:
     *         - application/json
     *       produces:
     *         - application/json
     *       responses:
     *         200:
     *            description: "Successfully retrieved"
     *         400:
     *            description: "Failed to retrieve"
     *         
     */
    async getBattlesCount(req, res) {
        try {

            let result = await indexDao.count(battles, {})
            if (result) {
                return response.send(200, "SUCCESS", result, req, res)
            } else {
                return response.error(response.buildError(400, "FAILURE"), '', req, res);
            }
        } catch (error) {
            console.log("Error: ", error)
            return response.error(response.buildError(400, "FAILURE"), error.message, req, res);
        }
    }

    /**
     * @swagger
     * paths:
     *   /stats:
     *     get:
     *       summary: Fetch battles stats
     *       description: Used for retrieving the details of an user
     *       tags: [Users]
     *       security:
     *       consumes:
     *         - application/json
     *       produces:
     *         - application/json
     *       responses:
     *         200:
     *            description: "Successfully retrieved"
     *         400:
     *            description: "Failed to retrieve"
     *         
     */
    async battlesStats(req, res) {
        try {
            let resultObj = {
                'most_active': {
                    'attacker_king': '',
                    'defender_king': '',
                    'region': '',
                    'name': ''
                },
                'attacker_outcome': {
                    'win': '', // total win
                    'loss': '' // total loss
                },
                'battle_type': [], // unique battle types
                'defender_size': {
                    'average': '',
                    'min': '',
                    'max': ''
                }
            }
            let battleTypeResult = await indexDao.aggregate(battles, [{
                $match: {
                    'battle_type': {
                        $ne: ""
                    }
                }
            }, {
                $group: {
                    _id: "$battle_type"
                }
            }]);
            resultObj.battle_type = battleTypeResult.map((obj) => {
                if (obj._id != "") {
                    return obj._id
                }
            });

            let attackerOutcomeResult = await indexDao.aggregate(battles, [{
                $match: {
                    'attacker_outcome': {
                        $ne: ''
                    }
                }
            }, {
                $group: {
                    _id: "$attacker_outcome",
                    count: {
                        $sum: 1
                    }
                }
            }]);
            attackerOutcomeResult.forEach(obj => {
                resultObj['attacker_outcome'][obj._id] = obj.count;
            });

            let defenderSizeResult = await indexDao.aggregate(battles, [{
                $match: {
                    'defender_size': {
                        $ne: NaN
                    }
                }
            }, {
                $group: {
                    _id: null,
                    min: {
                        $min: '$defender_size'
                    },
                    max: {
                        $max: '$defender_size'
                    },
                    average: {
                        $avg: '$defender_size'
                    }
                }
            }])
            defenderSizeResult = defenderSizeResult[0];
            delete defenderSizeResult['_id'];
            resultObj['defender_size'] = defenderSizeResult;

            return response.send(200, "SUCCESS", resultObj, req, res)
        } catch (error) {
            console.log("Error: ", error)
            return response.error(response.buildError(400, "FAILURE"), error.message, req, res);
        }
    }

    /**
     * @swagger
     * paths:
     *   /search:
     *     get:
     *       summary: Fetch battles count
     *       description: Used for retrieving the details of an user
     *       tags: [Users]
     *       security:
     *       parameters:
     *         - name: "king"
     *           in: "query"
     *           required: false
     *           description: user id should be given 
     *         - name: "location"
     *           in: "query"
     *           required: false
     *           description: user id should be given 
     *         - name: "type"
     *           in: "query"
     *           required: false
     *           description: user id should be given
     *       consumes:
     *         - application/json
     *       produces:
     *         - application/json
     *       responses:
     *         200:
     *            description: "Successfully retrieved"
     *         400:
     *            description: "Failed to retrieve"
     *         
     */
    async battlesSearch(req, res) {
        try {
            let data = req.query;
            let condition = {};
            if (data.king) {
                condition['$or'] = [{
                    'attacker_king': data.king
                }, {
                    'defender_king': data.king
                }]
            }
            if (data.location) {
                condition['location'] = data.location
            }
            if (data.type) {
                condition['battle_type'] = data.type
            }
            let result = await indexDao.find(battles, condition, {})
            if (result) {
                return response.send(200, "SUCCESS", result, req, res)
            } else {
                return response.error(response.buildError(400, "FAILURE"), '', req, res);
            }
        } catch (error) {
            console.log("Error: ", error)
            return response.error(response.buildError(400, "FAILURE"), error.message, req, res);
        }
    }

}

module.exports = new BattlesController();