import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authorization';
import { HistoryModel } from './models/history.model';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(
    @Req() req: AuthenticatedRequest,
    @Body() body: { trackId: string; origin: 'JAMENDO' | 'LOCAL' },
  ): Promise<void> {
    return this.historyService.upsertHistory(
      req.user.id,
      body.trackId,
      body.origin,
    );
  }

  @Get()
  async get(
    @Req() req: AuthenticatedRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<HistoryModel[]> {
    return this.historyService.getHistory(req.user.id, page, limit);
  }
}
