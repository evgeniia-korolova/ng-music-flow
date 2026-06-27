import { LibraryPlaylistTrack } from '../../track/model/track.model';

export interface LibraryPlaylist {
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  tracks: LibraryPlaylistTrack[];
}
