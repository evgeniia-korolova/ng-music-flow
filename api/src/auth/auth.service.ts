import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiException } from 'src/common/exceptions/api.exception';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './DTOs/RegisterDto';
import { UserEntity } from 'src/users/entities/user.entity/user.entity';
import { LoginDto } from './DTOs/LoginDto';
import { TokenPayload } from './interfaces/token-payload';
import { AuthResponse } from './interfaces/authorization';

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

  async updateJamendoTokens(
    user: TokenPayload,
    jamendoId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    if (user.jamendoId && user.jamendoId !== jamendoId) {
      throw new ApiException(
        {
          message: 'User is already linked to different jamendo account',
          code: 'AUTH.JAMENDO.CONFLICT',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    await this.users.update(user.id, {
      jamendoAccessToken: accessToken,
      jamendoRefreshToken: refreshToken,
    });
  }

  async linkJamendoAccount(
    user: TokenPayload,
    newJamendoId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    await this.users.update(user.id, {
      jamendoId: newJamendoId,
      jamendoAccessToken: accessToken,
      jamendoRefreshToken: refreshToken,
    });
  }
}
