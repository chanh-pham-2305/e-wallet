const Joi = require('joi')

const loginValidator = (data) =>{
    const rule = Joi.object({
        username: Joi.string()
                    .empty()
                    .required(),
        password: Joi.string()
                    .empty()
                    .min(6)
                    .required(),
    })

    return rule.validate(data)
}

module.exports = loginValidator