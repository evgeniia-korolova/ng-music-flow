import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Track } from '../../../entities/track/model/track.model';
import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { LibraryPlaylist } from '../../../entities/playlist/model/playlist.model';

export interface PlaylistTrackDto {
  track: Track;
  origin: 'JAMENDO' | 'LOCAL';
  orderId: number;
}

export interface PlaylistResponseDto {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  totalDuration: number;
  trackCount: number;
  createdAt: string;
  tracks: PlaylistTrackDto[];
}

export interface GetPlaylistsResponseDto {
  data: PlaylistResponseDto[];
  error: string | null;
}

export interface UpdatePlaylistTracksDto {
  name?: string;
  description?: string;
  tracks?: { trackId: string; origin: 'JAMENDO' | 'LOCAL'; order: number }[];
}

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
          })),
        };

        try {
          const savedPlaylist = await firstValueFrom(
            http.post<LibraryPlaylist>(apiAddr, createPayload),
          );

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
            tracks: p.tracks ? p.tracks.map((t: PlaylistTrackDto) => t.track) : [],
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

      async updatePlaylist(
        playlistId: string | undefined,
        updatedData: { name?: string; description?: string; tracks?: Track[] },
      ): Promise<void> {
        if (!playlistId) return;

        const currentPlaylist = store.playlists().find((p) => p.id === playlistId);
        if (!currentPlaylist) return;

        patchState(store, { isLoading: true, error: null });

        // Собираем тело запроса строго по контракту коллеги
        const patchPayload: UpdatePlaylistTracksDto = {};

        if (updatedData.name && updatedData.name !== currentPlaylist.name) {
          patchPayload.name = updatedData.name;
        }

        if (
          updatedData.description !== undefined &&
          updatedData.description !== currentPlaylist.description
        ) {
          patchPayload.description = updatedData.description;
        }

        // Присваиваем массив строго в ключ tracks!
        if (updatedData.tracks) {
          patchPayload.tracks = updatedData.tracks.map((track: Track, index: number) => ({
            trackId: track.id,
            origin: (track.origin || 'JAMENDO') as 'JAMENDO' | 'LOCAL',
            order: index + 1,
          }));
        }

        try {
          const response = await firstValueFrom(
            http.patch<PlaylistResponseDto>(`${apiAddr}/${playlistId}`, patchPayload),
          );

          const updatedPlaylist: LibraryPlaylist = {
            id: response.id,
            name: response.name,
            description: response.description || '',
            createdAt: response.createdAt,
            tracks:
              updatedData.tracks ||
              (response.tracks ? response.tracks.map((t: PlaylistTrackDto) => t.track) : []),
          };

          patchState(store, (state) => ({
            playlists: state.playlists.map((p) => (p.id === playlistId ? updatedPlaylist : p)),
            isLoading: false,
          }));

          console.log(`Плейлист успешно сохранен с полем tracks!`);
        } catch (err) {
          console.error('Failed to update playlist in NestJS:', err);
          patchState(store, { error: 'Не удалось обновить плейлист', isLoading: false });
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
