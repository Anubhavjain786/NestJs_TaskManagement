import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

export const isValid = inputs =>
  validate(inputs).then(errors => {
    if (errors.length > 0) {
      console.log('validation failed. errors: ', errors);
      throw new BadRequestException('Validation Error');
    } else {
      console.log('validation succeed');
      console.log(inputs);
      return true;
    }
  });
