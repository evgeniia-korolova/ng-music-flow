import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { AuthenticatedRequest } from '../interfaces/authorization';
import { JamendoUser } from '../interfaces/jamendo';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../interfaces/token-payload';
import { ApiException } from 'src/common/exceptions/api.exception';

@Injectable()
export class JamendoStrategy extends PassportStrategy(Strategy, 'jamendo') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super({
      authorizationURL: configService.getOrThrow<string>('JAMENDO_AUTH'),
      tokenURL: configService.getOrThrow<string>('JAMENDO_TOKEN'),
      clientID: configService.getOrThrow<string>('JAMENDO_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('JAMENDO_CLIENT_SECRET'),
      callbackURL: JamendoStrategy.getCallbackUrl(configService),
      passReqToCallback: true,
      state: false,
    });
  }

  async validate(
    req: AuthenticatedRequest,
    accessToken: string,
    refreshToken: string,
  ): Promise<TokenPayload> {
    const jamendoId = (await this.fetchJamendoProfile(accessToken)).id;

    if (req.user) {
      if (req.user.jamendoId) {
        await this.authService.updateJamendoTokens(
          req.user,
          jamendoId,
          accessToken,
          refreshToken,
        );
      } else {
        await this.authService.linkJamendoAccount(
          req.user,
          jamendoId,
          accessToken,
          refreshToken,
        );
      }

      return req.user;
    }

    const token = req.query['state'];

    if (typeof token === 'string' && token.length > 0) {
      try {
        const decodedUser = await this.jwtService.verifyAsync<TokenPayload>(
          token,
          {
            secret: this.configService.getOrThrow<string>('JWT_SECRET'),
          },
        );

        if (decodedUser.jamendoId) {
          await this.authService.updateJamendoTokens(
            decodedUser,
            jamendoId,
            accessToken,
            refreshToken,
          );
        } else {
          await this.authService.linkJamendoAccount(
            decodedUser,
            jamendoId,
            accessToken,
            refreshToken,
          );
        }

        const refinedUser = {
          id: decodedUser.id,
          email: decodedUser.email,
          username: decodedUser.username,
          roles: decodedUser.roles,
          jamendoId,
        };

        return refinedUser;
      } catch (err) {
        if (err instanceof ApiException) {
          throw err;
        }

        throw new UnauthorizedException(
          'Provided fallback URL token is invalid.',
        );
      }
    }

    throw new UnauthorizedException(
      'Could not resolve user identity context from request or URL token.',
    );
  }

  private static getCallbackUrl(config: ConfigService): string {
    const isProduction = config.get<string>('ENVIRONMENT');

    const baseUrl = isProduction
      ? config.getOrThrow<string>('HOSTED_API')
      : `http://localhost:${config.getOrThrow<string>('API_PORT')}`;

    return `${baseUrl}/auth/jamendo/callback`;
  }

  private async fetchJamendoProfile(accessToken: string): Promise<JamendoUser> {
    const clientId = this.configService.getOrThrow<string>('JAMENDO_CLIENT_ID');
    const url = `https://api.jamendo.com/v3.0/users?client_id=${clientId}&access_token=${accessToken}&format=json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new UnauthorizedException(
          'Failed to communicate with Jamendo API endpoint.',
        );
      }

      const json = (await response.json()) as { results?: JamendoUser[] };
      const userProfile = json?.results?.[0];

      if (!userProfile?.id) {
        throw new UnauthorizedException(
          'Jamendo profile payload returned empty or missing user identity.',
        );
      }

      return userProfile;
    } catch {
      throw new UnauthorizedException(
        'An error occurred while fetching the third-party user profile.',
      );
    }
  }
}
