import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

type MockConfigService = Partial<Record<keyof ConfigService, jest.Mock>>;

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: MockConfigService;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue('mock-secret'),
    };

    strategy = new JwtStrategy(configService as unknown as ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return the validated payload', () => {
    const payload = {
      id: 'user-1',
      email: 'test@example.com',
      username: 'tester',
      roles: ['user'],
      jamendoId: 'jam-123',
    };

    const result = strategy.validate(payload);
    expect(result).toEqual(payload);
  });
});
