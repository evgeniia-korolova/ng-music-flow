import { InjectionToken, Signal } from '@angular/core';
import { Track } from '../../../entities/track/model/track.model';

export interface TrackDataProvider {
  tracks: Signal<Track[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  listTitle: Signal<string>;
}

export const TRACK_DATA_PROVIDER = new InjectionToken<TrackDataProvider>('TrackDataProvider');
