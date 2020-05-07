import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import {
  NestMiddleware,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export class AllInputs implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    let allInputs = {
      ...req['params'],
      ...req['query'],
      ...req.body,
    };
    req['allInputs'] = allInputs;
    next();
  }
}

export const GetAllInputs = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    req['allInputs'].user = req.user;
    return req['allInputs'];
  },
);
