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
    const clientId = this.configService.getOrThrow<string>('JAMENDO_CLIENT_ID');

    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 500;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await fetch(
          `${baseUrl}/tracks/?client_id=${clientId}&id=${trackId}&format=json&include=stats`,
        );

        if (!res.ok) {
          throw new Error(`HTTP Error Status: ${res.status}`);
        }

        const data = (await res.json()) as JamendoResponse<JamendoTrackDto>;

        if (data.results?.length > 0) {
          console.info(`Jamendo was successful on try #${attempt}`);
          return data.results?.[0] ? mapJamendoToTrack(data.results[0]) : null;
        }
      } catch {
        return null;
      }
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }

    return null;
  }
}
