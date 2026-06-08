import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserEntity } from 'src/users/entities/user.entity/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = UserEntity>(err: unknown, user: TUser | false): TUser {
    if (err || !user) {
      throw (
        (err instanceof Error && err) ||
        new UnauthorizedException(
          'You must be logged in to access this resource',
        )
      );
    }

    return user;
  }
}
