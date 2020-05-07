import Joi = require('@hapi/joi');
import { HttpException, HttpStatus } from '@nestjs/common';

export const baseValidator = async function(schema, payload) {
  const rules = Joi.object()
    .options({ abortEarly: false, allowUnknown: true })
    .keys(schema);

  const { error, value } = rules.validate(payload);
  if (error) {
    const validationErrors = error.details;
    let errors = {};
    validationErrors.forEach(error => {
      errors[error.path[0]] = error.message;
    });
    throw new HttpException(errors, HttpStatus.BAD_REQUEST);
  } else {
    return value;
  }
};
