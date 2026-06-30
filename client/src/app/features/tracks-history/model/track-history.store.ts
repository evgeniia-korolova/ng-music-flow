import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { LibraryPlaylistTrack } from '../../../entities/track/model/track.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { HistoryBackendModel, HistoryResponseDto } from './history-dto.interface';

export interface HistoryState {
  items: HistoryBackendModel[];
  currentPage: number;
  filterDate: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  items: [],
  currentPage: 1,
  filterDate: null,
  isLoading: false,
  error: null,
};

export const HistoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    tracks: computed<LibraryPlaylistTrack[]>(() => {
      const historyData = store.items();
      const dateFilter = store.filterDate();

      const filtered = dateFilter
        ? historyData.filter((item) => item.playedAt.startsWith(dateFilter))
        : historyData;

      return filtered.map(
        (item) =>
          ({
            ...item.track,
            origin: item.origin,
            playedAtDate: item.playedAt,
          }) as LibraryPlaylistTrack,
      );
    }),

    listTitle: computed<string>(() => {
      const date = store.filterDate();
      return date ? `Recently Played (${date})` : 'Recently Played';
    }),
  })),

  withMethods((store, http = inject(HttpClient)) => {
    const apiAddr = `${environment.appApiUrl}/history`;

    return {
      changeFilterDate(date: string | null): void {
        patchState(store, { filterDate: date });
      },

      loadHistory: rxMethod<{ page?: number; limit?: number } | void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((params) => {
            const page = params?.page ?? 1;
            const limit = params?.limit ?? 20;

            const url = `${apiAddr}?page=${page}&limit=${limit}`;

            return http.get<HistoryResponseDto>(url).pipe(
              tapResponse({
                next: (response) => {
                  const incomingItems = response.data || [];

                  patchState(store, {
                    items: page === 1 ? incomingItems : [...store.items(), ...incomingItems],
                    currentPage: page,
                    isLoading: false,
                  });
                },
                error: (err) => {
                  console.error('Failed to load history in store:', err);
                  patchState(store, {
                    error: 'Failed to load history',
                    isLoading: false,
                  });
                },
              }),
            );
          }),
        ),
      ),

      addTrackToHistory: rxMethod<LibraryPlaylistTrack>(
        pipe(
          switchMap((track) => {
            const payload = {
              trackId: track.id,
              origin: track.origin || 'JAMENDO',
            };

            return http.post<void>(apiAddr, payload).pipe(
              tapResponse({
                next: () => {
                  const newItem: HistoryBackendModel = {
                    track: track,
                    origin: track.origin || 'JAMENDO',
                    playedAt: new Date().toISOString(),
                  };

                  patchState(store, (state) => ({
                    items: [newItem, ...state.items],
                  }));
                },
                error: (err) => console.error('Failed to save track to history in store:', err),
              }),
            );
          }),
        ),
      ),
    };
  }),
);
