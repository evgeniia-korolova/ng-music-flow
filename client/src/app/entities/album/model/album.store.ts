import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Album, ArtistAlbumsResponseDTO } from './album.model';
import { inject } from '@angular/core';
import { JamendoApiService } from '../../../shared/api/jamendo-api-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

export interface AlbumsState {
  items: Album[];
  isLoading: boolean;
  error: string | null;
}
const initialState: AlbumsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const AlbumStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, jamendoApi = inject(JamendoApiService)) => ({
    loadAlbums: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id: string) =>
          jamendoApi.get<ArtistAlbumsResponseDTO>('artists/albums', { id: id }).pipe(
            tapResponse({
              next: (response) => {
                const albums = response.results.length > 0 ? response.results[0].albums : [];
                patchState(store, {
                  items: albums,
                  isLoading: false,
                  error: null,
                });
              },
              error: (err: any) => {
                console.log(err);
                patchState(store, { isLoading: false, error: 'Error' });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
