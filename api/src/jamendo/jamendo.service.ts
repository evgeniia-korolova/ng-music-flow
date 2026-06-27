import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mapJamendoToTrack } from 'src/common/utils/mappings';
import { JamendoTrackDto } from 'src/library/DTOs/track.dto';
import { Track } from 'src/library/models/track.model';
import { JamendoResponse } from './jamendo-client';

@Injectable()
export class JamendoService {
  constructor(private readonly configService: ConfigService) {}

  async getTrackById(trackId: string): Promise<Track | null> {
    const baseUrl = this.configService.getOrThrow<string>('JAMENDO_BASE_URL');
    try {
      const res = await fetch(`${baseUrl}/tracks/?id=${trackId}&format=json`);
      const data = (await res.json()) as JamendoResponse<JamendoTrackDto>;
      return data.results?.[0] ? mapJamendoToTrack(data.results[0]) : null;
    } catch {
      return null;
    }
  }
}
