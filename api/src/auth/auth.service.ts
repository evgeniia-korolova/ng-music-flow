import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiException } from 'src/common/exceptions/api.exception';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './DTOs/RegisterDto';
import { UserEntity } from 'src/users/entities/user.entity/user.entity';
import { LoginDto } from './DTOs/LoginDto';

export type TokenPayload = Pick<
  UserEntity,
  'id' | 'email' | 'username' | 'roles'
>;

export type AuthResponse = {
  user: Omit<UserEntity, 'password'>;
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const newUser = await this.users.create(registerDto);

    return this.generateAuthResponse(newUser);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);

    if (!user) {
      throw new ApiException(
        {
          message: 'Invalid email or password',
          code: 'AUTH.INVALID.CREDENTIALS',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.generateAuthResponse(user);
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.users.findByEmailWithPassword(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
  }

  private generateAuthResponse(user: UserEntity): AuthResponse {
    const payload = this.createTokenPayload(user);

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles,
        createdAt: user.createdAt,
      },
    };
  }

  private createTokenPayload(user: UserEntity): TokenPayload {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
    };
  }
}
