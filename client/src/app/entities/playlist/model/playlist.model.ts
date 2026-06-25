import { Track } from '../../track/model/track.model';

export interface LibraryPlaylist {
  name: string;
  description?: string;
  tracks: Track[];
}
