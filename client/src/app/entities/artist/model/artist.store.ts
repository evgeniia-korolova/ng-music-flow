import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Artist, ArtistDto } from './artist.model';
import { inject } from '@angular/core';
import { JamendoApiService } from '../../../shared/api/jamendo-api-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { mapArtist } from '../../../shared/lib/map-artist';

export interface ArtistState {
  items: Artist[];
  isLoading: boolean;
  error: string | null;
  currentArtist: Artist | null;
}

const initialState: ArtistState = {
  items: [],
  isLoading: false,
  error: null,
  currentArtist: null,
};

export const ArtistStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, jamendoApi = inject(JamendoApiService)) => ({
    loadArtists: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          jamendoApi.get<ArtistDto>('artists', { limit: 20 }).pipe(
            tapResponse({
              next: (response) => {
                patchState(store, {
                  items: response.results.map(mapArtist),
                  isLoading: false,
                  error: null,
                });
              },
              error: (err) => {
                console.log(err);
                patchState(store, {
                  isLoading: false,
                  error: 'Failed to load artists. Try to reload page.',
                });
              },
            }),
          ),
        ),
      ),
    ),
    loadArtistById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id) =>
          jamendoApi.get<ArtistDto>('artists', { id: id }).pipe(
            tapResponse({
              next: (response) => {
                if (response.results && response.results.length > 0) {
                  patchState(store, {
                    isLoading: false,
                    error: null,
                    currentArtist: mapArtist(response.results[0]),
                  });
                } else {
                  patchState(store, {
                    isLoading: false,
                    error: "Artist don't find",
                    currentArtist: null,
                  });
                }
              },
              error: (err) => {
                console.log(err);
                patchState(store, { isLoading: false, error: 'Error' });
              },
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      store.loadArtists();
    },
  }),
);
