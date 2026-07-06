import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiException } from 'src/common/exceptions/api.exception';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './DTOs/register.dto';
import { UserEntity } from 'src/users/entities/user.entity/user.entity';
import { LoginDto } from './DTOs/login.dto';
import { TokenPayload } from './interfaces/token-payload';
import { AuthResponse } from './interfaces/authorization';
import { DatabaseError } from 'src/common/interfaces/database.error';
import { ChangePasswordDto } from './DTOs/change-password.dto';

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
        jamendoId: user.jamendoId,
      },
    };
  }

  private createTokenPayload(user: UserEntity): TokenPayload {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
      jamendoId: user.jamendoId,
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
    try {
      await this.users.update(user.id, {
        jamendoId: newJamendoId,
        jamendoAccessToken: accessToken,
        jamendoRefreshToken: refreshToken,
      });
    } catch (err: unknown) {
      const dbError = err as DatabaseError;

      if (dbError.code === '23505') {
        throw new ApiException(
          {
            message:
              'This Jamendo account is already linked to another user profile.',
            code: 'AUTH.JAMENDO.CONFLICT',
          },
          HttpStatus.CONFLICT,
        );
      }

      throw new ApiException(
        {
          message:
            'An unexpected database error occurred during account linkage.',
          code: 'AUTH.DATABASE.ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(
    user: TokenPayload,
    { oldPassword, newPassword }: ChangePasswordDto,
  ): Promise<void> {
    const validationResult = await this.validateUser(user.email, oldPassword);

    if (validationResult === null) {
      throw new ApiException(
        {
          message: 'Provided password does not match',
          code: 'AUTH.CHANGE_PASSWORD.MISMATCH',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateResult = await this.users.updatePassword(user.id, newPassword);

    if (!updateResult.affected) {
      throw new ApiException(
        {
          message: 'Failed to save new password',
          code: 'AUTH.CHANGE_PASSWORD.NO_UPDATE',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
