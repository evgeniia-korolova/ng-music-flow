import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PlaylistEntity,
  PlaylistTrackReference,
} from './entities/playlist.entity';
import { CreatePlaylistDto, UpdatePlaylistDto } from './DTOs/playlist.dto';
import {
  isPlaylistTrack,
  PlaylistModel,
  PlaylistTrack,
} from './models/playlist.model';
import { TracksService } from './tracks.service';
import { ApiException } from 'src/common/exceptions/api.exception';
import { JamendoService } from 'src/jamendo/jamendo.service';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
    private readonly tracksService: TracksService,
    private readonly jamendoService: JamendoService,
  ) {}

  async createPlaylist(
    userId: string,
    dto: CreatePlaylistDto,
  ): Promise<PlaylistModel> {
    const { updatedTracks, trackCount, totalDuration } =
      await this.processTracksAndCalculateMetrics(userId, dto.tracks);
    const playlist = this.playlistRepository.create({
      userId,
      name: dto.name,
      description: dto.description,
      tracks: updatedTracks,
      trackCount,
      totalDuration,
    });
    return this.mapToPlaylistModel(
      await this.playlistRepository.save(playlist),
    );
  }

  async getAllUserPlaylists(userId: string): Promise<PlaylistModel[]> {
    try {
      const playlists = await this.playlistRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });

      return Promise.all(playlists.map((p) => this.mapToPlaylistModel(p)));
    } catch {
      throw new ApiException(
        {
          message: 'Failed to connect to database',
          code: 'DATABASE.FAIL.OPERATION',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPlaylistById(
    userId: string,
    trackId: string,
  ): Promise<PlaylistModel> {
    try {
      const playlist = await this.playlistRepository.findOne({
        where: { userId, id: trackId },
      });

      if (playlist === null) {
        throw new ApiException(
          {
            message: 'Failed to connect to database',
            code: 'DATABASE.NOT_FOUND',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.mapToPlaylistModel(playlist);
    } catch {
      throw new ApiException(
        {
          message: 'Failed to connect to database',
          code: 'DATABASE.FAIL.OPERATION',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePlaylist(userId: string, playlistId: string): Promise<void> {
    const result = await this.playlistRepository.delete({
      id: playlistId,
      userId,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Playlist not found.');
    }
  }

  async updatePlaylist(
    userId: string,
    playlistId: string,
    dto: UpdatePlaylistDto,
  ): Promise<PlaylistModel> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId, userId },
    });
    if (!playlist) throw new NotFoundException('Playlist not found.');

    if (dto.name) playlist.name = dto.name;
    if (dto.description) playlist.description = dto.description;

    if (dto.tracks) {
      const trackRefs: PlaylistTrackReference[] = dto.tracks.map((t) => ({
        trackId: t.trackId,
        origin: t.origin,
        order: t.order,
      }));

      const { updatedTracks, trackCount, totalDuration } =
        await this.processTracksAndCalculateMetrics(userId, trackRefs);

      playlist.tracks = updatedTracks;
      playlist.trackCount = trackCount;
      playlist.totalDuration = totalDuration;
    }
    return this.mapToPlaylistModel(
      await this.playlistRepository.save(playlist),
    );
  }

  private async processTracksAndCalculateMetrics(
    userId: string,
    inputTracks: PlaylistTrackReference[],
  ): Promise<{
    updatedTracks: PlaylistTrackReference[];
    trackCount: number;
    totalDuration: number;
  }> {
    const ordered = [...inputTracks].sort((a, b) => a.order - b.order);

    const results = await Promise.all(
      ordered.map(async (ref) => {
        if (ref.origin === 'LOCAL') {
          const track = await this.tracksService.getLocalTrack(
            userId,
            ref.trackId,
          );
          return track
            ? { ref, duration: track.duration, valid: true }
            : { ref, duration: 0, valid: false };
        } else {
          const jamendoTrack = await this.jamendoService.getTrackById(
            ref.trackId,
          );
          return jamendoTrack
            ? { ref, duration: jamendoTrack.duration, valid: true }
            : { ref, duration: 0, valid: false };
        }
      }),
    );

    const validTracks = results.filter((r) => r.valid).map((r) => r.ref);
    const totalDuration = results.reduce((acc, curr) => acc + curr.duration, 0);

    if (validTracks.length === 0 && ordered.length > 0)
      throw new BadRequestException('All provided tracks are invalid.');

    return {
      updatedTracks: validTracks,
      trackCount: validTracks.length,
      totalDuration,
    };
  }

  private async mapToPlaylistModel(
    entity: PlaylistEntity,
  ): Promise<PlaylistModel> {
    const combined = await this.tracksService.getTracksForPlaylist(
      entity.userId,
      entity.tracks,
    );
    const results = await Promise.all(
      combined.map(async (item) =>
        isPlaylistTrack(item) ? item : await this.getJamendoTrack(item),
      ),
    );

    const playlistTracks: PlaylistTrack[] = [];
    const toRemove: PlaylistTrackReference[] = [];

    results.forEach((x) =>
      isPlaylistTrack(x) ? playlistTracks.push(x) : toRemove.push(x),
    );

    if (toRemove.length > 0) {
      entity.tracks = entity.tracks.filter(
        (ref) => !toRemove.some((rem) => rem.trackId === ref.trackId),
      );
      entity.totalDuration = playlistTracks.reduce(
        (acc, curr) => acc + curr.track.duration,
        0,
      );
      entity.trackCount = playlistTracks.length;
      await this.playlistRepository.update(entity.id, {
        tracks: entity.tracks,
        totalDuration: entity.totalDuration,
        trackCount: entity.trackCount,
      });
      return this.mapToPlaylistModel(entity);
    }

    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      tracks: playlistTracks,
      totalDuration: entity.totalDuration,
      trackCount: entity.trackCount,
      createdAt: entity.createdAt.toISOString().split('T')[0],
    };
  }

  private async getJamendoTrack(
    ref: PlaylistTrackReference,
  ): Promise<PlaylistTrack | PlaylistTrackReference> {
    const track = await this.jamendoService.getTrackById(ref.trackId);
    return track ? { origin: 'JAMENDO', orderId: ref.order, track } : ref;
  }
}
