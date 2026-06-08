import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Album, AlbumDetailsDto, AlbumWithTracks, ArtistAlbumsResponseDTO } from './album.model';
import { inject } from '@angular/core';
import { JamendoApiService } from '../../../shared/api/jamendo-api-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { mapTrack } from '../../track/lib/map-track';

export interface AlbumsState {
  items: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: AlbumWithTracks | null;
}
const initialState: AlbumsState = {
  items: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
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
              error: (err) => {
                console.log(err);
                patchState(store, { isLoading: false, error: 'Error' });
              },
            }),
          ),
        ),
      ),
    ),
    loadAlbumDetails: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id: string) =>
          jamendoApi.get<AlbumDetailsDto>('albums/tracks', { id: id }).pipe(
            tapResponse({
              next: (response) => {
                const rawAlbum = response.results[0];
                const readyTracks = rawAlbum.tracks.map((track) => mapTrack(track));
                patchState(store, {
                  isLoading: false,
                  error: null,
                  currentAlbum: { ...rawAlbum, tracks: readyTracks },
                });
              },
              error: (err) => {
                console.log(err);
                patchState(store, { isLoading: false, error: null });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
