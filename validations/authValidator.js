const Joi = require('joi');

exports.validateResendVerificationLink = (req) => {
  const schema = Joi.object({
    email: Joi.string().email({minDomainSegments: 2}).required(),
  });

  return schema.validate(req);
};


exports.validateSignIn = (req) => {
  const schema = Joi.object({
    email: Joi.string().email({minDomainSegments: 2}).required(),
    password: Joi.string().required(),
  });

  return schema.validate(req);
};

exports.validateVerifyEmail = (req) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    id: Joi.string().required(),
  });

  return schema.validate(req);
};
