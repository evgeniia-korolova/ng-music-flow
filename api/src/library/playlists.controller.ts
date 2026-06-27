import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto, UpdatePlaylistDto } from './DTOs/playlist.dto';
import { PlaylistModel } from './models/playlist.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authorization';

@Controller('playlists')
@UseGuards(JwtAuthGuard)
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createPlaylistDto: CreatePlaylistDto,
  ): Promise<PlaylistModel> {
    return this.playlistsService.createPlaylist(req.user.id, createPlaylistDto);
  }

  @Patch(':id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlaylistTracksDto: UpdatePlaylistDto,
  ): Promise<PlaylistModel> {
    return this.playlistsService.updatePlaylist(
      req.user.id,
      id,
      updatePlaylistTracksDto,
    );
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest): Promise<PlaylistModel[]> {
    return await this.playlistsService.getAllUserPlaylists(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PlaylistModel> {
    return this.playlistsService.getPlaylistById(req.user.id, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.playlistsService.deletePlaylist(req.user.id, id);
  }
}
