import { Track } from '../../track/model/track.model';

export interface LibraryTrackList {
  id: string;
  title: string;
  descr: string;
  tracksList: Track[];
}
