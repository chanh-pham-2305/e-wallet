const Joi = require('joi')

const transferValidator = (data) =>{
    const rule = Joi.object({
        payeePhone:Joi.string()
                .empty()
                .length(10)
                .required(),
        money:Joi.number()
                .empty()
                .required(),
        content: Joi.string()
                .empty()
                .required(),
    })

    return rule.validate(data)
}

module.exports = transferValidator