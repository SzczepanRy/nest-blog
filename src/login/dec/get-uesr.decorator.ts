import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const getUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request);

    return request.user;
  },
);
