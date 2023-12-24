import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Context = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('in user decorator')
    return {'username':'my name'};
  },
);