import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Track, TrackDto } from './track.model';
import { inject } from '@angular/core';
import { JamendoApiService } from '../../../shared/api/jamendo-api-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { mapTrack } from '../../../shared/lib/map-track';

export interface TracksState {
  items: Track[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TracksState = {
  items: [],
  isLoading: false,
  error: null,
};

export const TracksStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, jamendoApi = inject(JamendoApiService)) => ({
    loadTracks: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),

        switchMap(() =>
          jamendoApi
            .get<TrackDto>('tracks', {
              order: 'releasedate_desc',
              limit: 20,
            })
            .pipe(
              tapResponse({
                next: (response) => {
                  patchState(store, {
                    items: response.results.map(mapTrack),
                    isLoading: false,
                  });
                },
                error: (err) => {
                  console.error('API error inside store:', err);
                  patchState(store, {
                    error: 'Failed to load tracks. Try to reload page.',
                    isLoading: false,
                  });
                },
              }),
            ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      store.loadTracks();
    },
  }),
);
