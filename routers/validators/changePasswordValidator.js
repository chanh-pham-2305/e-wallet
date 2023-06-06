const Joi = require('joi')

const changePasswordValidator = (data) =>{
    const rule = Joi.object({
        oldPassword: Joi.string()
        .required()
        .min(6)
        .messages({
            'string.required': 'Please enter a new password',
            'string.min' : 'Password must be more than 6 characters'
        }),
        password: Joi.string()
                    .required()
                    .min(6)
                    .messages({
                        'string.required': 'Please enter a new password',
                        'string.min' : 'Password must be more than 6 characters'
                    }),
        rePassword: Joi.string()
                    .required()
                    .min(6)
                    .equal(Joi.ref('password'))
                    .messages({
                        'string.required': 'Please re-enter a new password',
                        'string.min' : 'Password must be more than 6 characters',
                        'string.ref': 'Password does not match',
                    }),
    })

    return rule.validate(data)
}

module.exports = changePasswordValidator