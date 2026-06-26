import { Track } from './track.model';

export interface PlaylistTrack {
  track: Track;
  origin: 'JAMENDO' | 'LOCAL';
  order: number;
}

export interface PlaylistModel {
  id: string;
  userId: string;
  name: string;
  description?: string;
  tracks: PlaylistTrack[];
  totalDuration: number;
  trackCount: number;
  createdAt: string;
}
