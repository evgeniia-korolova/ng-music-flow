import { Track } from '../../../entities/track/model/track.model';

export interface HistoryItem {
  id: string;
  track: Track;
  playedAt: string;
}
