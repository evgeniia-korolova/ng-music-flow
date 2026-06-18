import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './DTOs/RegisterDto';
import { LoginDto } from './DTOs/LoginDto';
import { AuthService } from './auth.service';
import {
  type AuthenticatedRequest,
  AuthResponse,
} from './interfaces/authorization';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { type Response } from 'express';
import { JamendoOAuthGuard } from './guards/jamendo.guard';
import { DatabaseError } from 'src/common/interfaces/database.error';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(loginDto);
  }

  @Get('jamendo')
  @UseGuards(JamendoOAuthGuard)
  jamendoAuth(): void {
    // empty on purpose
  }

  @Get('jamendo/callback')
  async jamendoCallback(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    const isProduction =
      this.configService.get<string>('ENVIRONMENT') === 'production';
    const frontendUrl = isProduction
      ? this.configService.getOrThrow<string>('HOSTED_CLIENT')
      : `http://localhost:${this.configService.getOrThrow<string>('CLIENT_PORT')}`;

    const guard = new (AuthGuard('jamendo'))();

    try {
      const context = {
        switchToHttp: () => ({
          getRequest: (): AuthenticatedRequest => req,
          getResponse: (): Response => res,
        }),
      } as unknown as ExecutionContext;

      const canActivate = await guard.canActivate(context);

      if (!canActivate || !req.user) {
        return res.redirect(
          `${frontendUrl}/auth/jamendo-result?error=AUTH.JAMENDO.FAILED`,
        );
      }

      return res.redirect(`${frontendUrl}/auth/jamendo`);
    } catch (err: unknown) {
      const errorCode = (err as DatabaseError).code ?? 'AUTH.JAMENDO.FAILED';

      return res.redirect(`${frontendUrl}/auth/jamendo?error=${errorCode}`);
    }
  }
}
