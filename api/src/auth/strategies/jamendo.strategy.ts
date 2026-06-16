import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { AuthenticatedRequest } from '../interfaces/authorization';
import { JamendoUser } from '../interfaces/jamendo';

@Injectable()
export class JamendoStrategy extends PassportStrategy(Strategy, 'jamendo') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      authorizationURL: configService.getOrThrow<string>('JAMENDO_AUTH'),
      tokenURL: configService.getOrThrow<string>('JAMENDO_TOKEN'),
      clientID: configService.getOrThrow<string>('JAMENDO_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('JAMENDO_CLIENT_SECRET'),
      callbackURL: JamendoStrategy.getCallbackUrl(configService),
      passReqToCallback: true,
    });
  }

  async validate(
    req: AuthenticatedRequest,
    accessToken: string,
    refreshToken: string,
    profile: JamendoUser,
  ): Promise<void> {
    if (req.user.jamendoId) {
      await this.authService.updateJamendoTokens(
        req.user,
        profile.id,
        accessToken,
        refreshToken,
      );
    } else {
      await this.authService.linkJamendoAccount(
        req.user,
        profile.id,
        accessToken,
        refreshToken,
      );
    }
  }

  private static getCallbackUrl(config: ConfigService): string {
    const isProduction = config.get<string>('ENVIRONMENT');

    const baseUrl = isProduction
      ? config.getOrThrow<string>('HOSTED_API')
      : `http://localhost:${config.getOrThrow<string>('API_PORT')}`;

    return `${baseUrl}/auth/jamendo/callback`;
  }
}
