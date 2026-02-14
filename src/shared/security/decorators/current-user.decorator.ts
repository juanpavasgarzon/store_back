import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { IUser } from '../interfaces';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): IUser => {
  const request = ctx.switchToHttp().getRequest<{ user: IUser }>();
  return request.user;
});
