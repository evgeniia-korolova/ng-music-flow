import { Track } from '../../../entities/track/model/track.model';

export interface HistoryBackendModel {
  track: Track;
  origin: 'JAMENDO' | 'LOCAL';
  playedAt: string;
}

export interface HistoryResponseDto {
  data: HistoryBackendModel[];
  error: string | null;
}
