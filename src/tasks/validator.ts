import { TaskStatus } from './task.status.enum';
import { baseValidator } from 'src/interceptors/validation/baseValidator';
import Joi = require('@hapi/joi');

const schema = function(type) {
  switch (type) {
    case 'get-task':
      return {
        status: Joi.any()
          .allow('DONE', 'OPEN', 'IN_PROGRESS')
          .optional(),

        search: Joi.string().optional(),
      };

    case 'create-task':
      return {
        title: Joi.string()
          .max(255)
          .required(),

        description: Joi.string().required(),
      };
  }
};

export const validate = function(type, inputs) {
  return baseValidator(schema(type), inputs);
};
