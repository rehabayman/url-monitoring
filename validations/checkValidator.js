const Joi = require('joi');

exports.validateCheck = (check) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        url: Joi.string().min(5).required(),
        protocol:Joi.string().required(),
        path:Joi.string(),
        port:Joi.number(),
        webhook:Joi.string(),
        timeout: Joi.number(),
        interval:Joi.number(),
        threshold: Joi.number(),
        userId: Joi.string().required(),
        ignoreSSL:Joi.bool(),
        status:Joi.string(),
        tags:Joi.array().items(Joi.string()),
    });

    return schema.validate(check);
}