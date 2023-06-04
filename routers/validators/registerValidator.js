const Joi = require('joi')

const registerValidator = (data) => {
    const rule = Joi.object({
        phone: Joi.string()
                .empty()
                .length(10)
                .required()
                .messages({
                    'string.empty': `"phone" is not allowed to be empty`,
                    'string.length': `"phone" must have 10 numbers`,
                }),
        email: Joi.string()
                .empty()
                .email()
                .required(),
        fullname: Joi.string()
                .empty()
                .min(5)
                .required(),
        date: Joi.date()
                .empty()
                .required(),
        address: Joi.string()
                .empty()
                .required(),
    })

    return rule.validate(data)
}

module.exports = registerValidator