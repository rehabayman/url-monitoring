const Joi = require('joi');

exports.validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50),
        email: Joi.string().email({ minDomainSegments: 2}).required(),
        password: Joi.string().min(6).max(255).required()
    });

    return schema.validate(user);
}