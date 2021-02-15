'use strict';
const _ = require('lodash');

class indexDao {

    async findOne(model, condition, projection) {
        return await model.findOne(condition, projection);
    }
    async find(model, condition, projection) {
        return await model.find(condition, projection);
    }
    async count(model, condition) {
        return await model.count(condition)
    }
    async aggregate(model, expression) {
        return await model.aggregate(expression)
    }
}

module.exports = new indexDao();