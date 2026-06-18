import { UserEntity } from 'src/users/entities/user.entity/user.entity';
import { TokenPayload } from './token-payload';
import { Request } from 'express';

export type AuthResponse = {
  user: Omit<UserEntity, 'password'>;
  accessToken: string;
};

export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}
