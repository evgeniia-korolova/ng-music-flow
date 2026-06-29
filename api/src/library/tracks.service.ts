import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SupabaseClient } from '@supabase/supabase-js';
import { TrackEntity } from './entities/track.entity';
import { SUPABASE_CLIENT } from 'src/common/constants';
import { TrackUploadDto, NestMulterFile } from './DTOs/track.dto';
import { randomUUID } from 'node:crypto';
import * as musicMeta from 'music-metadata';
import decode from 'audio-decode';
import { Track } from './models/track.model';
import { PlaylistTrackReference } from './entities/playlist.entity';
import { PlaylistTrack } from './models/playlist.model';

@Injectable()
export class TracksService {
  private readonly bucketName: string;

  constructor(
    @InjectRepository(TrackEntity)
    private readonly trackRepository: Repository<TrackEntity>,

    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {
    this.bucketName = process.env.SUPABASE_BUCKET || 'tracks';
  }

  async uploadAndCreate(
    payload: TrackUploadDto & { userId: string; file: NestMulterFile },
  ): Promise<Track> {
    const { userId, title, artist, genre, file } = payload;

    let duration = 0;
    try {
      const metadata = await musicMeta.parseBuffer(file.buffer, {
        mimeType: file.mimetype,
      });
      duration = metadata.format.duration
        ? Math.round(metadata.format.duration)
        : 0;
    } catch {
      throw new BadRequestException(
        'Could not parse audio file metadata header.',
      );
    }

    const waveform = await this.generateWaveform(file.buffer, 200);

    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${userId}/${randomUUID()}.${fileExtension}`;

    const { data, error: uploadError } = await this.supabase.storage
      .from(this.bucketName)
      .upload(uniqueFileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw new InternalServerErrorException(
        `Supabase upload failed: ${uploadError.message}`,
      );
    }

    const { data: urlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      throw new InternalServerErrorException(
        'Failed to generate public URL from Supabase.',
      );
    }

    const track = this.trackRepository.create({
      userId,
      title,
      artist,
      genre,
      url: urlData.publicUrl,
      duration,
      waveform,
    });

    const savedTrack = await this.trackRepository.save(track);

    return this.mapToModel(savedTrack);
  }

  async getLocalTracks(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    tracks: Track[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [entities, total] = await this.trackRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    });

    return {
      tracks: entities.map((entity) => this.mapToModel(entity)),
      total,
      page,
      limit,
    };
  }

  async getLocalTrack(userId: string, trackId: string): Promise<Track | null> {
    const result = await this.trackRepository.findOne({
      where: { userId: userId, id: trackId },
    });

    if (result) {
      return this.mapToModel(result);
    }

    return null;
  }

  async getTracksForPlaylist(
    userId: string,
    trackRefs: PlaylistTrackReference[],
  ): Promise<(PlaylistTrack | PlaylistTrackReference)[]> {
    const trackIds = trackRefs.map((ref) => ref.trackId);
    const tracks = await this.trackRepository.find({
      where: {
        userId,
        id: In(trackIds),
      },
    });
    const trackedTracks = new Set(tracks.map((track) => track.id));
    const result: (PlaylistTrack | PlaylistTrackReference)[] = [];

    trackRefs.forEach((ref) => {
      if (trackedTracks.has(ref.trackId)) {
        const playlistTrack: PlaylistTrack = {
          track: this.mapToModel(
            tracks.find((track) => track.id === ref.trackId)!,
          ),
          origin: ref.origin,
          order: ref.order,
        };

        result.push(playlistTrack);
      } else {
        result.push(ref);
      }
    });

    return result;
  }

  async getLocalTrackTitles(
    userId: string,
  ): Promise<Array<{ id: string; title: string }>> {
    return this.trackRepository.find({
      where: { userId },
      select: {
        id: true,
        title: true,
      },
      order: { title: 'ASC' },
    });
  }

  async removeTrack(userId: string, trackId: string): Promise<void> {
    const track = await this.trackRepository.findOne({
      where: { id: trackId, userId },
    });

    if (!track) {
      throw new BadRequestException('Track not found or access denied.');
    }

    const pathSegments = track.url.split(`${this.bucketName}/`);
    if (pathSegments.length > 1) {
      const storagePath = pathSegments[1];
      await this.supabase.storage.from(this.bucketName).remove([storagePath]);
    }

    await this.trackRepository.remove(track);
  }

  private async generateWaveform(
    buffer: Buffer,
    points = 400,
  ): Promise<number[]> {
    try {
      const audioBuffer = (await decode(buffer)) as unknown as {
        duration: number;
        sampleRate: number;
        numberOfChannels: number;
        channelData: Float32Array[];
      };

      if (audioBuffer.channelData.length === 0)
        throw new Error('0 length channelData returned');

      const channelData = audioBuffer.channelData[0];
      const totalSamples = channelData.length;

      const blockSize = Math.floor(totalSamples / points);
      const waveform: number[] = [];
      for (let i = 0; i < points; i++) {
        const start = i * blockSize;
        const end = start + blockSize;
        let max = 0;

        for (let j = start; j < end; j++) {
          const val = Math.abs(channelData[j]);
          if (val > max) {
            max = val;
          }
        }

        waveform.push(max);
      }

      const maxPeak = Math.max(...waveform);
      if (maxPeak === 0) return new Array(points).fill(0) as number[];

      return waveform.reduce((acc: number[], peak) => {
        const normalizedWavelength = Math.round((peak / maxPeak) * 100) / 100;
        if (normalizedWavelength > 0.2) {
          acc.push(normalizedWavelength);
        }
        return acc;
      }, []);
    } catch (error) {
      console.error(error);
      return Array.from(
        { length: points },
        () => Math.floor(Math.random() * 40) + 20,
      );
    }
  }

  private mapToModel(entity: TrackEntity): Track {
    let waveform: number[] = [];

    if (Array.isArray(entity.waveform)) {
      waveform = entity.waveform;
    } else if (typeof entity.waveform === 'string') {
      (entity.waveform as string).split(',').forEach(Number);
    }

    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      artist: {
        id: '',
        name: entity.artist,
      },
      genre: entity.genre,
      audioUrl: entity.url,
      duration: entity.duration,
      releasedate: entity.createdAt.toISOString().split('T')[0],
      waveform,
      album: {
        id: '',
        name: '',
      },
      coverUrl: '',
      playCount: 0,
      rating: 0,
    };
  }
}
