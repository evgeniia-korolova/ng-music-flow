import { ExecutionContext } from '@nestjs/common';
import { JamendoOAuthGuard } from './jamendo.guard';
import { Request } from 'express';

describe('JamendoOAuthGuard', () => {
  let guard: JamendoOAuthGuard;

  beforeEach((): void => {
    guard = new JamendoOAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extract state from request query', (): void => {
    const mockRequest = {
      query: { state: 'test-state' },
    } as unknown as Request;

    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: (): Request => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const options = guard.getAuthenticateOptions(mockContext);
    expect(options).toEqual({ state: 'test-state' });
  });

  it('should return undefined state if query state is missing', (): void => {
    const mockRequest = {
      query: {},
    } as unknown as Request;

    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: (): Request => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const options = guard.getAuthenticateOptions(mockContext);
    expect(options.state).toBeUndefined();
  });
});
