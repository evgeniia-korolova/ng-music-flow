import { Track } from './track.model';

export interface HistoryModel {
  track: Track;
  origin: 'JAMENDO' | 'LOCAL';
  playedAt: string;
}
