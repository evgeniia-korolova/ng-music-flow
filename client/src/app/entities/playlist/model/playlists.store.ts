import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { LibraryPlaylistTrack } from '../../track/model/track.model';
import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { LibraryPlaylist } from './playlist.model';
import {
  GetPlaylistsResponseDto,
  PlaylistResponseDto,
  SinglePlaylistResponseDto,
} from './playlist-dto.interface';
import { mapPlaylistResponseToLibraryPlaylist } from './map-playlist-respose-back';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

export interface PlaylistsState {
  playlists: LibraryPlaylist[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PlaylistsState = {
  playlists: [],
  isLoading: false,
  error: null,
};

export const PlaylistsStore = signalStore(
  withState(initialState),

  withComputed((store) => ({
    getPlaylistByName: computed(() => (name: string) => {
      return store.playlists().find((p) => p.name === name);
    }),
  })),

  withMethods((store, http = inject(HttpClient)) => {
    const apiAddr = `${environment.appApiUrl}/playlists`;

    return {
      createPlaylist: rxMethod<{
        playlistData: { name: string; description?: string; tracks: LibraryPlaylistTrack[] };
        onSuccess?: (savedPlaylist: LibraryPlaylist) => void;
        onError?: (err: unknown) => void;
      }>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(({ playlistData, onSuccess, onError }) => {
            const createPayload = {
              name: playlistData.name,
              description: playlistData.description || undefined,
              tracks: playlistData.tracks.map((track, index) => ({
                trackId: track.id,
                origin: track.origin || 'JAMENDO',
                order: track.order ?? index + 1,
              })),
            };

            return http.post<SinglePlaylistResponseDto>(apiAddr, createPayload).pipe(
              // tap((rawResponseFromBackend) => {
              //   console.log('=== СЫРОЙ ОТВЕТ С БЭКА НА POST (СОЗДАНИЕ) ===');
              //   console.dir(rawResponseFromBackend);
              // }),
              tapResponse({
                next: (responseDto) => {
                  const playlistRawData = responseDto.data;

                  const savedPlaylist = mapPlaylistResponseToLibraryPlaylist(playlistRawData);

                  patchState(store, (state) => ({
                    playlists: [savedPlaylist, ...state.playlists],
                    isLoading: false,
                  }));

                  if (onSuccess) {
                    onSuccess(savedPlaylist);
                  }
                },
                error: (err: unknown) => {
                  console.error('Failed to save playlist to Supabase via NestJS:', err);
                  patchState(store, { error: 'fail to create playlist', isLoading: false });
                  if (onError) onError(err);
                },
              }),
            );
          }),
        ),
      ),

      loadPlaylists: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() =>
            http.get<GetPlaylistsResponseDto>(apiAddr).pipe(
              tapResponse({
                next: (response) => {
                  const rawPlaylists: PlaylistResponseDto[] = response.data || [];
                  const mappedPlaylists: LibraryPlaylist[] = rawPlaylists.map(
                    (p: PlaylistResponseDto) => mapPlaylistResponseToLibraryPlaylist(p),
                  );

                  patchState(store, { playlists: mappedPlaylists, isLoading: false });
                },
                error: (err) => {
                  console.error('Failed to load playlists from NestJS:', err);
                  patchState(store, { error: 'Failed to load playlists', isLoading: false });
                },
              }),
            ),
          ),
        ),
      ),

      deletePlaylist: rxMethod<string>(
        pipe(
          tap((playlistId) => {
            if (!playlistId) {
              console.warn('failed delete playlist: ID is not defined');
            }
            patchState(store, { isLoading: true, error: null });
          }),

          filter((playlistId) => !!playlistId),
          switchMap((playlistId) =>
            http.delete<void>(`${apiAddr}/${playlistId}`).pipe(
              tapResponse({
                next: () => {
                  patchState(store, (state) => ({
                    playlists: state.playlists.filter((p) => p.id !== playlistId),
                    isLoading: false,
                  }));
                },
                error: (err) => {
                  console.error('Failed to delete playlist from NestJS:', err);
                  patchState(store, { error: 'Failed to delete playlist', isLoading: false });
                },
              }),
            ),
          ),
        ),
      ),

      updateLocalPlaylistTracks(playlistId: string, updatedTracks: LibraryPlaylistTrack[]): void {
        patchState(store, (state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,

                  tracks: updatedTracks,
                }
              : playlist,
          ),
        }));
      },

      updatePlaylist: rxMethod<{
        playlistId: string;
        playlistData: { name?: string; description?: string; tracks?: LibraryPlaylistTrack[] };
        onSuccess?: () => void;
        onError?: (err: unknown) => void;
      }>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(({ playlistId, playlistData, onSuccess, onError }) => {
            const updatePayload = {
              name: playlistData.name,
              description: playlistData.description || undefined,
              tracks: playlistData.tracks
                ? playlistData.tracks.map((track) => ({
                    trackId: track.id,
                    origin: track.origin || 'JAMENDO',
                    order: track.order || 1,
                  }))
                : undefined,
            };

            return http
              .patch<SinglePlaylistResponseDto>(`${apiAddr}/${playlistId}`, updatePayload)
              .pipe(
                tapResponse({
                  next: (responseDto) => {
                    const updatedPlaylist = mapPlaylistResponseToLibraryPlaylist(responseDto.data);

                    patchState(store, (state) => ({
                      playlists: state.playlists.map((p) =>
                        p.id === playlistId ? updatedPlaylist : p,
                      ),
                      isLoading: false,
                    }));

                    if (onSuccess) {
                      onSuccess();
                    }
                  },
                  error: (err: unknown) => {
                    console.error('Failed to update playlist:', err);
                    patchState(store, { error: 'Failed to update playlist', isLoading: false });

                    if (onError) {
                      onError(err);
                    }
                  },
                }),
              );
          }),
        ),
      ),

      // ----
    };
  }),

  withHooks({
    onInit(store) {
      void store.loadPlaylists();
    },
  }),
);
