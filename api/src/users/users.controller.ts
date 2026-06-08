import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserEntity } from './entities/user.entity/user.entity';

@Controller('users')
export class UsersController {
  @Get('info')
  @UseGuards(JwtAuthGuard)
  getProfileInfo(@Req() req: Request): UserEntity {
    return req.user as UserEntity;
  }
}
