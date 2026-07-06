import { LibraryPlaylistTrack } from './playlist.model';

export interface PlaylistTrackDto {
  track: LibraryPlaylistTrack;
  origin: 'JAMENDO' | 'LOCAL';
  order: number;
}

export interface PlaylistResponseDto {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  totalDuration: number;
  trackCount: number;
  createdAt: string;
  tracks: PlaylistTrackDto[];
}

export interface GetPlaylistsResponseDto {
  data: PlaylistResponseDto[];
  error: string | null;
}

export interface UpdatePlaylistTracksDto {
  name?: string;
  description?: string;
  tracks?: {
    trackId: string;
    origin: 'JAMENDO' | 'LOCAL';
    order: number;
    coverUrl?: string;
    waveform?: number[];

    title?: string;
    duration?: number;
    artistName?: string;
    albumName?: string;
  }[];
}

export interface SinglePlaylistResponseDto {
  data: PlaylistResponseDto;
  error: string | null;
}
