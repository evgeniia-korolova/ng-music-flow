import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { TRACK_DATA_PROVIDER } from '../../../../widgets/tracks-list/model/track-provider.token';

import TracksList from '../../../../widgets/tracks-list/tracks-list';
import { HistoryStore } from '../../model/track-history.store';
import { AuthStore } from '../../../../entities/user/user.state';
import { DatePipe } from '@angular/common';
import { Button } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-history-content',
  imports: [TracksList, DatePipe, Button],
  templateUrl: './history-content.html',
  styleUrl: './history-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TRACK_DATA_PROVIDER,
      useExisting: HistoryStore,
    },
  ],
})
export class HistoryContent {
  public historyStore = inject(HistoryStore);
  private readonly authStore = inject(AuthStore);

  constructor() {
    effect(() => {
      const isAuth = this.authStore.isUnsafeAuthenticated();

      if (isAuth) {
        this.historyStore.loadHistory({ page: 1, limit: 20 });
      }
    });
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.historyStore.changeFilterDate(input.value || null);
  }

  public onLoadMore(): void {
    this.historyStore.loadNextPage();
  }
}
