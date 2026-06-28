import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

import { LibraryPlaylist, LibraryPlaylistTrack } from './playlist-model.interface';
import {
  GetPlaylistsResponseDto,
  PlaylistResponseDto,
  PlaylistTrackDto,
  UpdatePlaylistTracksDto,
} from './playlist-dto.interface';

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
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    getPlaylistByName: computed(() => (name: string) => {
      return store.playlists().find((p) => p.name === name);
    }),
  })),

  withMethods((store, http = inject(HttpClient)) => {
    const apiAddr = `${environment.appApiUrl}/playlists`;

    return {
      async createPlaylist(playlistData: LibraryPlaylist): Promise<LibraryPlaylist> {
        patchState(store, { isLoading: true, error: null });

        const createPayload = {
          name: playlistData.name,
          description: playlistData.description || undefined,
          tracks: playlistData.tracks.map((track, index) => ({
            trackId: track.id,
            origin: track.origin || 'JAMENDO',
            order: index + 1,
            coverUrl: track.coverUrl || '/images/track-placeholder.jpg',
            waveform: track.waveform || [],
          })),
        };

        try {
          const responseDto = await firstValueFrom(
            http.post<PlaylistResponseDto>(apiAddr, createPayload),
          );

          const savedPlaylist: LibraryPlaylist = {
            id: responseDto.id,
            name: responseDto.name,
            description: responseDto.description || '',
            createdAt: responseDto.createdAt,

            tracks: responseDto.tracks
              ? responseDto.tracks.map((t) => ({
                  ...t.track,
                  coverUrl: t.track.coverUrl,
                  waveform: t.track.waveform || [],
                  origin: t.origin,
                  order: t.order,
                }))
              : [],
          };

          patchState(store, (state) => ({
            playlists: [...state.playlists, savedPlaylist],
            isLoading: false,
          }));

          await this.loadPlaylists();

          return savedPlaylist;
        } catch (err) {
          console.error('Failed to save playlist to Supabase via NestJS:', err);
          patchState(store, { error: 'fail to create playlist', isLoading: false });
          throw err;
        }
      },

      async loadPlaylists(): Promise<void> {
        patchState(store, { isLoading: true, error: null });

        try {
          const response = await firstValueFrom(http.get<GetPlaylistsResponseDto>(apiAddr));

          console.log('--- ЧТО ПРИШЛО С БЭКА НА GET ---', response);

          const rawPlaylists: PlaylistResponseDto[] = response.data || [];

          const mappedPlaylists: LibraryPlaylist[] = rawPlaylists.map((p: PlaylistResponseDto) => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            createdAt: p.createdAt,

            tracks: p.tracks
              ? p.tracks.map((t: PlaylistTrackDto) => {
                  const rawTrack = t.track;

                  return {
                    ...rawTrack,
                    coverUrl: rawTrack.coverUrl,
                    waveform: rawTrack.waveform || [],
                    origin: t.origin,
                    order: t.order,
                  };
                })
              : [],
          }));

          patchState(store, { playlists: mappedPlaylists, isLoading: false });
        } catch (err) {
          console.error('Failed to load playlists from NestJS:', err);
          patchState(store, { error: 'Failed to load playlists', isLoading: false });
        }
      },

      async deletePlaylist(playlistId: string): Promise<void> {
        if (!playlistId) {
          console.warn('failed delete playlist: ID is not defined');
          return;
        }
        patchState(store, { isLoading: true, error: null });

        try {
          await firstValueFrom(http.delete<void>(`${apiAddr}/${playlistId}`));

          patchState(store, (state) => ({
            playlists: state.playlists.filter((p) => p.id !== playlistId),
            isLoading: false,
          }));

          console.log(`Playlist с ID ${playlistId} deleted!`);
        } catch (err) {
          console.error('Failed to delete playlist from NestJS:', err);
          patchState(store, { error: 'Failed to delete playlist', isLoading: false });
        }
      },

      updateLocalPlaylistTracks(playlistId: string, updatedTracks: LibraryPlaylistTrack[]): void {
        patchState(store, (state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  // Просто заменяем массив треков на новый, так как типы теперь идеально совпадают!
                  tracks: updatedTracks,
                }
              : playlist,
          ),
        }));
      },

      async updatePlaylist(playlistId: string, dto: UpdatePlaylistTracksDto): Promise<void> {
        patchState(store, { isLoading: true, error: null });
        const token = localStorage.getItem('ngMusicFlow:token');

        try {
          const responseDto = await firstValueFrom(
            http.post<PlaylistResponseDto>(`${apiAddr}/${playlistId}`, dto, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          );

          patchState(store, (state) => ({
            playlists: state.playlists.map((p) =>
              p.id === playlistId
                ? {
                    ...p,
                    name: responseDto.name,
                    description: responseDto.description || '',

                    tracks: responseDto.tracks
                      ? responseDto.tracks.map((t) => ({
                          ...t.track,
                          origin: t.origin,
                          order: t.order,
                          coverUrl: t.track.coverUrl,
                          waveform: t.track.waveform || [],
                        }))
                      : p.tracks,
                  }
                : p,
            ),
            isLoading: false,
          }));

          await this.loadPlaylists();
        } catch (err) {
          console.error('Failed to update playlist:', err);
          patchState(store, { error: 'Failed to update playlist', isLoading: false });
          throw err;
        }
      },
    };
  }),

  withHooks({
    onInit(store) {
      void store.loadPlaylists();
    },
  }),
);
