import { HttpClient } from '@angular/common/http';
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, of, tap } from 'rxjs';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HistoryItem } from './history.types';
import { Track } from '../../../entities/track/model/track.model';

@Injectable({
  providedIn: 'root',
})
export class TrackHistoryTwoService {
  private http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  private readonly apiAddr = `${environment.appApiUrl}/history`;

  private readonly _filterDate = signal<string | null>(null);

  public readonly filterDate = this._filterDate.asReadonly();

  private readonly _customError = signal<string | null>(null);

  private readonly historyResource = rxResource<HistoryItem[], { date: string | null }>({
    params: () => ({ date: this._filterDate() }),

    stream: ({ params }) => {
      const url = params.date ? `${this.apiAddr}?date=${params.date}` : this.apiAddr;

      return this.http.get<HistoryItem[]>(url).pipe(
        catchError((err) => {
          console.error('Failed to load history in rxResource:', err);
          this._customError.set('Failed to load history');
          return of([] as HistoryItem[]);
        }),
      );
    },
    defaultValue: [] as HistoryItem[],
  });

  public readonly tracks = computed<Track[]>(() => {
    const historyData = this.historyResource.value() ?? [];
    return historyData.map((item) => item.track);
  });

  public readonly isLoading = this.historyResource.isLoading;

  public readonly error = computed<string | null>(() => {
    return this.historyResource.error() ? 'Network Error' : null;
  });

  public readonly listTitle = computed<string>(() => {
    const date = this._filterDate();
    return date ? `Recently Played (${date})` : 'Recently Played';
  });

  public changeFilterDate(date: string | null): void {
    this._filterDate.set(date);
  }

  public addTrackToHistory(track: Track): void {
    this.http
      .post<HistoryItem>(this.apiAddr, { trackId: track.id })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.historyResource.reload();
        }),
      )
      .subscribe({
        error: (err) => console.error('RxResource POST failed:', err),
      });
  }
}
