import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { HistoryItem } from './history.types';
import { computed, inject } from '@angular/core';
import { Track } from '../../../entities/track/model/track.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

export interface HistoryState {
  items: HistoryItem[];
  filterDate: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  items: [],
  filterDate: null,
  isLoading: false,
  error: null,
};

export const HistorySignalStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    tracks: computed<Track[]>(() => {
      const historyData = store.items();
      const dateFilter = store.filterDate();

      const filtered = dateFilter
        ? historyData.filter((item) => item.playedAt.startsWith(dateFilter))
        : historyData;

      return filtered.map((item) => item.track);
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

      loadHistory: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() => {
            const date = store.filterDate();
            const url = date ? `${apiAddr}?date=${date}` : apiAddr;

            return http.get<HistoryItem[]>(url).pipe(
              tapResponse({
                next: (items) => patchState(store, { items, isLoading: false }),
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

      addTrackToHistory: rxMethod<Track>(
        pipe(
          switchMap((track) =>
            http.post<HistoryItem>(apiAddr, { trackId: track.id }).pipe(
              tapResponse({
                next: (newItem) => {
                  patchState(store, (state) => ({
                    items: [newItem, ...state.items],
                  }));
                },
                error: (err) => console.error('Failed to save track to history in store:', err),
              }),
            ),
          ),
        ),
      ),
    };
  }),
);
