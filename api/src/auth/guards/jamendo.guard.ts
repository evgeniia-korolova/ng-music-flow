import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JamendoOAuthGuard extends AuthGuard('jamendo') {
  override getAuthenticateOptions(
    context: ExecutionContext,
  ): Record<string, unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const state = request.query.state;

    return {
      state: typeof state === 'string' ? state : undefined,
    };
  }
}
