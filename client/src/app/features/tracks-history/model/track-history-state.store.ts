import { computed, inject, Injectable, signal } from '@angular/core';
import { HistoryItem } from './history.types';
import { TrackDataProvider } from '../../../widgets/tracks-list/model/track-provider.token';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Track } from '../../../entities/track/model/track.model';
import { firstValueFrom } from 'rxjs';

export interface HistoryState {
  items: HistoryItem[];
  filterDate: string | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SignalStateHistoryService implements TrackDataProvider {
  private readonly http = inject(HttpClient);
  private readonly apiAddr = `${environment.appApiUrl}/history`;

  private readonly state = signal<HistoryState>({
    items: [],
    filterDate: null,
    isLoading: false,
    error: null,
  });

  public readonly filterDate = computed(() => this.state().filterDate);

  public readonly tracks = computed<Track[]>(() => {
    const historyData = this.state().items;
    const dateFilter = this.state().filterDate;

    const filtered = dateFilter
      ? historyData.filter((item) => item.playedAt.startsWith(dateFilter))
      : historyData;

    return filtered.map((item) => item.track);
  });

  public readonly isLoading = computed(() => this.state().isLoading);
  public readonly error = computed(() => this.state().error);

  public readonly listTitle = computed<string>(() => {
    const date = this.state().filterDate;
    return date ? `Recently Played (${date})` : 'Recently Played';
  });

  public async loadHistory(): Promise<void> {
    this.state.update((s) => ({ ...s, isLoading: true, error: null }));
    const date = this.state().filterDate;
    const url = date ? `${this.apiAddr}?date=${date}` : this.apiAddr;

    try {
      const data = await firstValueFrom(this.http.get<HistoryItem[]>(url));

      this.state.update((s) => ({ ...s, items: data, isLoading: false }));
    } catch (err) {
      console.error('Ошибка загрузки истории в SignalState:', err);
      this.state.update((s) => ({ ...s, error: 'Failed to load history', isLoading: false }));
    }
  }

  public changeFilterDate(date: string | null): void {
    this.state.update((s) => ({ ...s, filterDate: date }));
    void this.loadHistory();
  }

  public async addTrackToHistory(track: Track): Promise<void> {
    try {
      const newItem = await firstValueFrom(
        this.http.post<HistoryItem>(this.apiAddr, { trackId: track.id }),
      );

      this.state.update((s) => ({
        ...s,
        items: [newItem, ...s.items],
      }));
    } catch (err) {
      console.error('Failed to save track to history', err);
    }
  }
}
