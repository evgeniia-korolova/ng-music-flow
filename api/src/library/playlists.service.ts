import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  PlaylistEntity,
  PlaylistTrackReference,
} from './entities/playlist.entity';
import { TrackEntity } from './entities/track.entity';
import {
  CreatePlaylistDto,
  UpdatePlaylistTracksDto,
} from './DTOs/playlist.dto';
import { PlaylistModel, PlaylistTrack } from './models/playlist.model';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,

    @InjectRepository(TrackEntity)
    private readonly trackRepository: Repository<TrackEntity>,
  ) {}

  async createPlaylist(
    userId: string,
    dto: CreatePlaylistDto,
  ): Promise<PlaylistModel> {
    try {
      const { updatedTracks, trackCount, totalDuration } =
        await this.processTracksAndCalculateMetrics(dto.tracks);

      const playlist = this.playlistRepository.create({
        userId,
        name: dto.name,
        description: dto.description,
        tracks: updatedTracks,
        trackCount,
        totalDuration,
      });

      const savedPlaylist = await this.playlistRepository.save(playlist);
      return this.mapToPlaylistModel(savedPlaylist);
    } catch (error: unknown) {
      this.handleDatabaseError(error, dto.name);
      throw error;
    }
  }

  async getPlaylistById(
    userId: string,
    playlistId: string,
  ): Promise<PlaylistModel> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found or access denied.');
    }

    return this.mapToPlaylistModel(playlist);
  }

  // async getAllUserPlaylists(userId: string): Promise<PlaylistModel[]> {
  //   const playlists = await this.playlistRepository.find({
  //     where: { userId },
  //     order: { createdAt: 'DESC' },
  //   });

  //   return Promise.all(
  //     playlists.map((playlist) => this.mapToPlaylistModel(playlist)),
  //   );
  // }

  async getAllUserPlaylists(userId: string): Promise<PlaylistModel[]> {
    const playlists = await this.playlistRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const sortedPlaylists: PlaylistModel[] = [];

    for (const playlist of playlists) {
      const mapped = await this.mapToPlaylistModel(playlist);
      sortedPlaylists.push(mapped);
    }

    return sortedPlaylists;
  }

  async updatePlaylist(
    userId: string,
    playlistId: string,
    dto: UpdatePlaylistTracksDto,
  ): Promise<PlaylistModel> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found or access denied.');
    }

    if (dto.name) playlist.name = dto.name;
    if (dto.description) playlist.description = dto.description;

    if (dto.tracks) {
      const { updatedTracks, trackCount, totalDuration } =
        await this.processTracksAndCalculateMetrics(dto.tracks);

      playlist.tracks = updatedTracks;
      playlist.trackCount = trackCount;
      playlist.totalDuration = totalDuration;
    }

    try {
      const savedPlaylist = await this.playlistRepository.save(playlist);
      return this.mapToPlaylistModel(savedPlaylist);
    } catch (error: unknown) {
      this.handleDatabaseError(error, dto.name || playlist.name);
      throw error;
    }
  }

  async deletePlaylist(
    userId: string,
    playlistId: string,
  ): Promise<{ message: string }> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found or access denied.');
    }

    await this.playlistRepository.remove(playlist);
    return { message: 'Playlist successfully deleted.' };
  }

  private async processTracksAndCalculateMetrics(
    inputTracks: {
      trackId: string;
      origin: 'JAMENDO' | 'LOCAL';
      order: number;
    }[],
  ): Promise<{
    updatedTracks: PlaylistTrackReference[];
    trackCount: number;
    totalDuration: number;
  }> {
    const orderedPayload = [...inputTracks].sort((a, b) => a.order - b.order);

    const localTrackIds = orderedPayload
      .filter((t) => t.origin === 'LOCAL')
      .map((t) => t.trackId);

    const localTracksFromDb =
      localTrackIds.length > 0
        ? await this.trackRepository.findBy({ id: In(localTrackIds) })
        : [];

    const localDurationMap = new Map<string, number>(
      localTracksFromDb.map((t) => [t.id, t.duration || 0]),
    );

    let accumulatedDuration = 0;

    const updatedTracks: PlaylistTrackReference[] = orderedPayload.map(
      (track) => {
        const duration =
          track.origin === 'LOCAL'
            ? localDurationMap.get(track.trackId) || 0
            : 180;

        accumulatedDuration += duration;

        return {
          trackId: track.trackId,
          origin: track.origin,
          order: track.order,
        };
      },
    );

    return {
      updatedTracks,
      trackCount: updatedTracks.length,
      totalDuration: accumulatedDuration,
    };
  }

  private handleDatabaseError(error: unknown, playlistName: string): void {
    if (error && typeof error === 'object' && 'code' in error) {
      const pgError = error as { code: string };
      if (pgError.code === '23505') {
        throw new BadRequestException(
          `A playlist named "${playlistName}" already exists.`,
        );
      }
    }
  }

  private async mapToPlaylistModel(
    entity: PlaylistEntity,
  ): Promise<PlaylistModel> {
    const localTrackIds = entity.tracks
      .filter((t) => t.origin === 'LOCAL')
      .map((t) => t.trackId);

    const localTracksFromDb =
      localTrackIds.length > 0
        ? await this.trackRepository.findBy({ id: In(localTrackIds) })
        : [];

    const localTracksMap = new Map<string, TrackEntity>(
      localTracksFromDb.map((track) => [track.id, track]),
    );

    const sortedDbTracks = [...entity.tracks].sort((a, b) => a.order - b.order);
    const hydratedTracks: PlaylistTrack[] = [];

    for (const trackRef of sortedDbTracks) {
      if (trackRef.origin === 'LOCAL') {
        const fullTrack = localTracksMap.get(trackRef.trackId);

        if (fullTrack) {
          hydratedTracks.push({
            origin: 'LOCAL',
            order: trackRef.order,
            track: {
              id: fullTrack.id,
              title: fullTrack.title,
              duration: fullTrack.duration,
              artist: {
                id: fullTrack.userId,
                name: fullTrack.artist,
              },
              album: {
                id: '',
                name: 'Single',
              },
              genre: fullTrack.genre,
              coverUrl: 'assets/images/default-cover.png',
              audioUrl: fullTrack.url,
              playCount: 0,
              rating: 0,
              waveform: Array.isArray(fullTrack.waveform)
                ? fullTrack.waveform
                : (fullTrack.waveform as string).split(',').map(Number),
              releasedate: fullTrack.createdAt.toISOString().split('T')[0],
            },
          });
        }
      } else {
        hydratedTracks.push({
          origin: 'JAMENDO',
          order: trackRef.order,
          track: {
            id: trackRef.trackId,
            title: 'Jamendo Stream Track',
            duration: 180,
            artist: { id: 'external-artist-id', name: 'Jamendo Artist' },
            album: { id: 'external-album-id', name: 'Jamendo Album' },
            genre: 'External Stream',
            coverUrl: 'assets/images/default-jamendo-cover.png',
            audioUrl: `https://api.jamendo.com/v3.0/tracks/file/?id=${trackRef.trackId}&action=stream`,
            playCount: 0,
            rating: 0,
            waveform: [],
            releasedate: new Date().toISOString().split('T')[0],
          },
        });
      }
    }

    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      tracks: hydratedTracks,
      totalDuration: entity.totalDuration,
      trackCount: entity.trackCount,
      createdAt: entity.createdAt.toISOString().split('T')[0],
    };
  }
}
