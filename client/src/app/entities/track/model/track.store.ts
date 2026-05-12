import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Track } from './track.model';
import { inject } from '@angular/core';
import { JamendoApiService } from '../../../shared/api/jamendo-api-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

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
            .get<Track>('tracks', {
              order: 'popularity_total',
              limit: 20,
            })
            .pipe(
              tapResponse({
                next: (response) =>
                  patchState(store, {
                    items: response.results,
                    isLoading: false,
                  }),
                error: (err) => {
                  console.error('API error:', err);
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
);
