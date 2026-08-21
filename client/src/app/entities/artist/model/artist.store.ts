import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Artist, ArtistDto } from './artist.model';
import { inject } from '@angular/core';
import { JamendoApiService } from '../../../shared/api/jamendo-api-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, forkJoin, pipe, switchMap, tap } from 'rxjs';
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
  tracksOffset: number;
  hasMoreTracks: boolean;
}

const initialState: ArtistState = {
  items: [],
  isLoading: false,
  error: null,
  currentArtist: null,
  albums: [],
  tracks: [],
  tracksOffset: 0,
  hasMoreTracks: true,
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
            tracksReq: jamendoApi.get<TrackDto>('tracks', {
              artist_id: id,
              limit: 6,
            }),
          }).pipe(
            tapResponse({
              next: (response) => {
                console.log(response);
                const initialTracks = (response.tracksReq.results || []).map((track: TrackDto) =>
                  mapTrack(track),
                );
                patchState(store, {
                  currentArtist: mapArtist(response.artistReq.results[0]),
                  albums: response.albumsReq.results[0]?.albums || [],
                  tracks: initialTracks,
                  tracksOffset: 6,
                  isLoading: false,
                  error: null,
                  hasMoreTracks: initialTracks.length === 6,
                });
              },
              error: (err) => {
                console.log(err);
                patchState(store, { isLoading: false, hasMoreTracks: false, error: 'Error' });
              },
            }),
          ),
        ),
      ),
    ),
    loadMoreTracks: rxMethod<void>(
      pipe(
        switchMap(() => {
          const artistId = store.currentArtist()?.id;
          if (!artistId) return EMPTY;
          return jamendoApi
            .get<TrackDto>('tracks', {
              artist_id: artistId,
              limit: 6,
              offset: store.tracksOffset(),
            })
            .pipe(
              tapResponse({
                next: (response) => {
                  const newTracks = (response.results || []).map((track: TrackDto) =>
                    mapTrack(track),
                  );
                  patchState(store, {
                    tracks: [...store.tracks(), ...newTracks],
                    tracksOffset: store.tracksOffset() + 6,
                    hasMoreTracks: newTracks.length === 6,
                  });
                },
                error: (err) => {
                  console.log(err);
                  patchState(store, { isLoading: false, error: 'Error' });
                },
              }),
            );
        }),
      ),
    ),
  })),
);
