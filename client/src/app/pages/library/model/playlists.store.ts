import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Track } from '../../../entities/track/model/track.model';
import { inject } from '@angular/core';
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
            tracks: p.tracks ? p.tracks.map((t: PlaylistTrackDto) => t.track) : [],
          }));

          patchState(store, { playlists: mappedPlaylists, isLoading: false });
        } catch (err) {
          console.error('Failed to load playlists from NestJS:', err);
          patchState(store, { error: 'Failed to load playlists', isLoading: false });
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
