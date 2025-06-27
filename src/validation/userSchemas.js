const Joi = require('joi');

exports.createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('employee', 'manager').required(),
  employee_code: Joi.string().pattern(/^\d{7}$/).required()
});

exports.updateUserSchema = Joi.object({
  id: Joi.string().required(),
  username: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional().allow('')
});

exports.deleteUserSchema = Joi.object({
  id: Joi.string().required()
});
