/* eslint-disable @typescript-eslint/unbound-method */

import { JamendoStrategy } from './jamendo.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from '../interfaces/authorization';
import { JamendoUser } from '../interfaces/jamendo';

type JamendoStrategyWithSpy = JamendoStrategy & {
  fetchJamendoProfile: (accessToken: string) => Promise<JamendoUser>;
};

describe('JamendoStrategy', () => {
  let strategy: JamendoStrategy;
  let authService: jest.Mocked<AuthService>;
  let configService: jest.Mocked<ConfigService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    authService = {
      linkJamendoAccount: jest.fn(),
      updateJamendoTokens: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    configService = {
      getOrThrow: jest.fn((key: string) => {
        const config: Record<string, string> = {
          JAMENDO_AUTH: 'auth',
          JAMENDO_TOKEN: 'token',
          JAMENDO_CLIENT_ID: 'cid',
          JAMENDO_CLIENT_SECRET: 'secret',
          JWT_SECRET: 'jwt-secret',
        };
        return config[key];
      }),
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    jwtService = {
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    strategy = new JamendoStrategy(authService, configService, jwtService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should link jamendo account when req.user exists and jamendoId is missing', async () => {
      const mockReq = {
        user: { id: 'user-1', jamendoId: null },
      } as unknown as AuthenticatedRequest;

      const jamendoProfile: JamendoUser = {
        id: 'jamendoId',
        name: 'name',
      };
      jest
        .spyOn(strategy as JamendoStrategyWithSpy, 'fetchJamendoProfile')
        .mockResolvedValue(jamendoProfile);

      const result = await strategy.validate(
        mockReq,
        'access-token',
        'refresh-token',
      );

      const linkJamendoAccountMock =
        authService.linkJamendoAccount as jest.Mock;

      expect(linkJamendoAccountMock).toHaveBeenCalledWith(
        mockReq.user,
        jamendoProfile.id,
        'access-token',
        'refresh-token',
      );
      expect(result).toEqual(mockReq.user);
    });

    it('should throw UnauthorizedException when context is missing', async () => {
      const mockReq = {
        user: null,
        query: {},
      } as unknown as AuthenticatedRequest;

      await expect(strategy.validate(mockReq, 'at', 'rt')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should process fallback token when provided via query state', async () => {
      const mockReq = {
        user: null,
        query: { state: 'valid-jwt-token' },
      } as unknown as AuthenticatedRequest;

      const decodedUser = {
        id: 'user-1',
        email: 'a@b.com',
        username: 'test',
        roles: [],
        jamendoId: null,
      };

      jwtService.verifyAsync.mockResolvedValue(decodedUser);
      jest
        .spyOn(strategy as JamendoStrategyWithSpy, 'fetchJamendoProfile')
        .mockResolvedValue({ id: 'jam-new', name: '' });

      const result = await strategy.validate(mockReq, 'at', 'rt');

      expect(authService.linkJamendoAccount).toHaveBeenCalled();
      expect(result.jamendoId).toBe('jam-new');
    });
  });
});
