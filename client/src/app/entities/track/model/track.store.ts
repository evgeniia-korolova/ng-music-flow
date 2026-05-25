import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Track, TrackDto } from './track.model';
import { inject } from '@angular/core';
import { JamendoApiService } from '../../../shared/api/jamendo-api-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { of, pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { mapTrack } from '../lib/map-track';
import { isValidRichTrack } from './track.validator';

export interface TracksState {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
  listTitle: string;
}

const initialState: TracksState = {
  tracks: [],
  isLoading: false,
  error: null,
  listTitle: 'Popular',
};

export const TracksStore = signalStore(
  withState(initialState),
  withMethods((store, jamendoApi = inject(JamendoApiService)) => {
    const tabsCache = new Map<string, Track[]>();

    return {
      setListTitle(title: string) {
        patchState(store, { listTitle: title });
      },

      loadTracks: rxMethod<{ order: string; limit: number }>(
        pipe(
          switchMap((params) => {
            const cacheKey = `order:${params.order}|limit:${params.limit}`;

            if (tabsCache.has(cacheKey)) {
              const cachedTracks = tabsCache.get(cacheKey) || [];

              patchState(store, {
                tracks: cachedTracks,
                isLoading: false,
                error: null,
              });

              return of(null);
            }

            patchState(store, { isLoading: true, error: null });

            return jamendoApi
              .get<TrackDto>('tracks', {
                order: params.order,
                limit: params.limit,
                include: 'stats',
              })
              .pipe(
                tapResponse({
                  next: (response) => {
                    const allMappedTracks = response.results.map(mapTrack);

                    const richTracks = allMappedTracks.filter(isValidRichTrack);

                    const targetLimit = store.listTitle() === 'Popular Tracks' ? 15 : 10;
                    const finalTracks = richTracks.slice(0, targetLimit);

                    tabsCache.set(cacheKey, finalTracks);

                    patchState(store, {
                      tracks: finalTracks,
                      isLoading: false,
                      error: null,
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
              );
          }),
        ),
      ),
    };
  }),
);
