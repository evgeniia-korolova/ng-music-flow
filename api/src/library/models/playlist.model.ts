import { PlaylistTrackReference } from '../entities/playlist.entity';
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

export function isPlaylistTrack(
  item: PlaylistTrack | PlaylistTrackReference,
): item is PlaylistTrack {
  return (item as PlaylistTrack).track !== undefined;
}
