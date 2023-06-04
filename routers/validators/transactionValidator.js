const Joi = require('joi')

const transactionValidator = (data) =>{
    const rule = Joi.object({
        money: Joi.number()
                .empty()
                .required()
    })

    return rule.validate(data)
}

module.exports = transactionValidator