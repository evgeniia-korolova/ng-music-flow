import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TRACK_DATA_PROVIDER } from '../../../../widgets/tracks-list/model/track-provider.token';

import TracksList from '../../../../widgets/tracks-list/tracks-list';
import { HistoryStore } from '../../model/track-history.store';

@Component({
  selector: 'app-history-content',
  imports: [TracksList],
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
  public historyService = inject(HistoryStore);

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.historyService.changeFilterDate(input.value || null);
  }
}
