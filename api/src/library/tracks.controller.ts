import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TracksService } from './tracks.service';
import { TrackUploadDto, type NestMulterFile } from '../library/DTOs/trackDto';
import { LocalTrack } from '../library/models/track.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authorization';
import { AudioFileValidator } from './validators/audio-file.validator';

@Controller('tracks')
@UseGuards(JwtAuthGuard)
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTrack(
    @Req() req: AuthenticatedRequest,
    @UploadedFile(new AudioFileValidator({ maxSize: 30 * 1024 * 1024 }))
    file: NestMulterFile,
    @Body() uploadDto: TrackUploadDto,
  ): Promise<LocalTrack> {
    return this.tracksService.uploadAndCreate({
      ...uploadDto,
      userId: req.user.id,
      file,
    });
  }

  @Get()
  async getUserTracks(
    @Req() req: AuthenticatedRequest,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<{
    tracks: LocalTrack[];
    total: number;
    page: number;
    limit: number;
  }> {
    const userId = req.user.id;

    return this.tracksService.getUserTracks(userId, page ?? 1, limit ?? 20);
  }

  @Get('titles')
  async getUserTrackTitles(
    @Req() req: AuthenticatedRequest,
  ): Promise<Array<{ id: string; title: string }>> {
    const userId = req.user.id;

    return this.tracksService.getUserTrackTitles(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) trackId: string,
  ): Promise<void> {
    const userId = req.user.id;

    await this.tracksService.removeTrack(userId, trackId);
  }
}
