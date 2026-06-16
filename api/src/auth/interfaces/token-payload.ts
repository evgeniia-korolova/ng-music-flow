import { UserEntity } from 'src/users/entities/user.entity/user.entity';

export type TokenPayload = Pick<
  UserEntity,
  'id' | 'email' | 'username' | 'roles' | 'jamendoId'
>;
