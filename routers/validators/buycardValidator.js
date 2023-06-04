const Joi = require('joi')

const buyCardValidator = (data) =>{
    const rule = Joi.object({
        provider: Joi.string()
                    .exist()
                    .required(),
        cardValue: Joi.number()
                    .empty()
                    .required(),
        amount: Joi.number()
                    .empty()
                    .required(),
    })

    return rule.validate(data)
}

module.exports = buyCardValidator