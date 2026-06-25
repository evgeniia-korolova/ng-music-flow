import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { JamendoStrategy } from './strategies/jamendo.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresInMinutes = Number.parseInt(
          configService.get<string>('JWT_EXPIRES_IN', '7d'),
          //10,
        );

        const expiresInSeconds = expiresInMinutes * 60;

        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: expiresInSeconds,
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JamendoStrategy],
  exports: [AuthService, PassportModule, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
