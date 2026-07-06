import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HistoryItem } from './history.types';
import { Track } from '../../../entities/track/model/track.model';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { AudioPlayerService } from '../../../shared/services/audio-player/audio-player-service';
import { ApiResponse } from '../../../shared/api/api-response';

@Injectable({
  providedIn: 'root',
})
export class TrackHistoryService {
  private readonly http = inject(HttpClient);
  private readonly playerService = inject(AudioPlayerService);
  private readonly apiAddr = `${environment.appApiUrl}/history`;

  private readonly _filterDate = signal<string | null>(null);
  public readonly filterDate = this._filterDate.asReadonly();

  private readonly refreshTrigger = signal<number>(0);
  private lastTrackIdSaved: string | null = null;

  private readonly historyResource = httpResource<ApiResponse<HistoryItem[]>>(
    () => {
      const date = this._filterDate();

      let url = `${this.apiAddr}?_t=${this.refreshTrigger()}`;

      if (date) url += `&date=${date}`;

      return { url, method: 'GET' };
    },
    {
      defaultValue: { data: [], error: null },
    },
  );

  public readonly tracks = computed<Track[]>(() => {
    const historyData = this.historyResource.value().data;

    if (historyData === null) {
      return [];
    }

    const dateFilter = this._filterDate();

    const filteredItems = dateFilter
      ? historyData.filter((item) => item.playedAt.startsWith(dateFilter))
      : historyData;

    return filteredItems?.map((item) => item.track);
  });

  public readonly isLoading = this.historyResource.isLoading;
  public readonly error = computed<string | null>(() => {
    const err = this.historyResource.error();
    return err ? 'Failed to load history' : null;
  });

  public readonly listTitle = computed<string>(() => {
    const date = this._filterDate();
    return date ? `Recently Played (${date})` : 'Recently Played';
  });

  public readonly tracksForList = computed<Track[]>(() => {
    const historyData = this.historyResource.value().data ?? [];
    const dateFilter = this._filterDate();

    const filteredItems = dateFilter
      ? historyData.filter((item) => item.playedAt.startsWith(dateFilter))
      : historyData;

    return filteredItems.map((item) => item.track);
  });

  constructor() {
    effect(() => {
      const track = this.playerService.currentTrack();
      const isPlaying = this.playerService.isPlaying();
      if (track && isPlaying && track.id !== this.lastTrackIdSaved) {
        this.lastTrackIdSaved = track.id;
        void this.trackPlayed(track);
      } else if (!track) {
        this.lastTrackIdSaved = null;
      }
    });
  }

  public changeFilterDate(date: string | null): void {
    this._filterDate.set(date);
  }

  public async trackPlayed(track: Track): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<HistoryItem>(this.apiAddr, { trackId: track.id, origin: track.origin }),
      );

      this.refreshTrigger.update((v) => v + 1);
    } catch (err) {
      console.error('Failed to load track to history:', err);
    }
  }
}
