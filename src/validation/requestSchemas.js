const Joi = require('joi');

exports.createRequestSchema = Joi.object({
  user_id: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required(),
  reason: Joi.string().min(3).required()
});

exports.updateStatusSchema = Joi.object({
  request_id: Joi.string().required(),
  status: Joi.string().valid('pending', 'approved', 'rejected').required()
});

exports.deleteRequestSchema = Joi.object({
  request_id: Joi.string().required()
});
