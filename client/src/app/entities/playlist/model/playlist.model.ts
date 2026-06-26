import { Track } from '../../track/model/track.model';

export interface LibraryPlaylist {
  id?: string;
  name: string;
  description?: string;
  tracks: Track[];
}
