const Joi = require('joi');

const validateUserRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const validateFileUpload = (data) => {
  const schema = Joi.object({
    file: Joi.object().required(),
  });
  return schema.validate(data);
};

module.exports = {
  validateUserRegistration,
  validateFileUpload,
};
