import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Artist, ArtistDto, ArtistTracksResponseDTO } from './artist.model';
import { inject } from '@angular/core';
import { JamendoApiService } from '../../../shared/api/jamendo-api-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { forkJoin, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { mapArtist } from '../../../shared/lib/map-artist';
import { Album, ArtistAlbumsResponseDTO } from '../../album/model/album.model';
import { Track, TrackDto } from '../../track/model/track.model';
import { mapTrack } from '../../track/lib/map-track';

export interface ArtistState {
  items: Artist[];
  isLoading: boolean;
  error: string | null;
  currentArtist: Artist | null;
  albums: Album[];
  tracks: Track[];
}

const initialState: ArtistState = {
  items: [],
  isLoading: false,
  error: null,
  currentArtist: null,
  albums: [],
  tracks: [],
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

    loadArtistProfile: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),

        switchMap((id) =>
          forkJoin({
            artistReq: jamendoApi.get<ArtistDto>('artists', { id: id }),
            albumsReq: jamendoApi.get<ArtistAlbumsResponseDTO>('artists/albums', { id: id }),
            tracksReq: jamendoApi.get<ArtistTracksResponseDTO>('artists/tracks', { id: id }),
          }).pipe(
            tapResponse({
              next: (response) => {
                console.log(response);
                patchState(store, {
                  currentArtist: mapArtist(response.artistReq.results[0]),
                  albums: response.albumsReq.results[0]?.albums || [],
                  tracks: (response.tracksReq.results[0]?.tracks || []).map((track: TrackDto) =>
                    mapTrack(track),
                  ),
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
  })),
);
