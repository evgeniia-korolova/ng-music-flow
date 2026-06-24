import { Track } from '../../track/model/track.model';

export interface TrackList {
  id: string;
  title: string;
  descr: string;
  tracksList: Track[];
}
