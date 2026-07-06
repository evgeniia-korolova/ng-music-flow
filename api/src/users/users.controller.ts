import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserEntity } from './entities/user.entity/user.entity';
import { UsersService } from './users.service';
import { TokenPayload } from 'src/auth/interfaces/token-payload';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getProfileInfo(@Req() req: Request): Promise<UserEntity | null> {
    const userId = (req.user as TokenPayload).id;

    return await this.usersService.findById(userId);
  }
}
