import { Track } from '../../track/model/track.model';

export interface LibraryPlaylistTrack extends Track {
  origin?: 'JAMENDO' | 'LOCAL';
  order?: number;
}

export interface LibraryPlaylist {
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  tracks: LibraryPlaylistTrack[];
}
