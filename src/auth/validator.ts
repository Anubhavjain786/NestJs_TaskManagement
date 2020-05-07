import { baseValidator } from 'src/interceptors/validation/baseValidator';
import Joi = require('@hapi/joi');

const schema = function(type) {
  switch (type) {
    case 'signin':
      return {
        email: Joi.string().email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net'] },
        }),

        password: Joi.string().pattern(
          new RegExp('/((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/'),
        ),
      };

    case 'create-task':
      return {
        email: Joi.string().email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net'] },
        }),

        password: Joi.string().pattern(
          new RegExp('/((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/'),
        ),
      };
  }
};

export const validate = function(type, inputs) {
  return baseValidator(schema(type), inputs);
};
