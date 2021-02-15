/* Source:
 https://github.com/hapijs/joi,
 https://github.com/hapijs/joi/blob/v10.4.2/API.md
 https://hapijs.com/api#error-transformation

 abortEarly - when true, stops validation on the first error,
 otherwise returns all the errors found. Defaults to true.
 */

const Joi = require('joi');

class ValidatorUtil {
    validate(values, schema) {
        // return Joi.validate(values, schema);
        return schema.validate(values);
    };

    /* Checks if the date is valid, returns false if the date is not valid */
    isDateLimitValid(time, limit) {
        if (time === '0') {
            time = new Date();
        }

        const timeLimitSchema = Joi.object().options({
            abortEarly: false
        }).keys({
            time: Joi.date().iso().required(),
            limit: Joi.number().min(1).required()
        });

        const validateResult = validatorUtil.validate({
            time: time,
            limit: limit
        }, timeLimitSchema);

        return validateResult.error === null;
    }
}

let validatorUtil = new ValidatorUtil();
exports = module.exports = validatorUtil;