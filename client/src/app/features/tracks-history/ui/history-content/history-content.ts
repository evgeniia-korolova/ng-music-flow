import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TRACK_DATA_PROVIDER } from '../../../../widgets/tracks-list/model/track-provider.token';
import { TrackHistoryService } from '../../model/track-history-service';
import TracksList from '../../../../widgets/tracks-list/tracks-list';

@Component({
  selector: 'app-history-content',
  imports: [TracksList],
  templateUrl: './history-content.html',
  styleUrl: './history-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TRACK_DATA_PROVIDER,
      useExisting: TrackHistoryService,
    },
  ],
})
export class HistoryContent {
  public historyService = inject(TrackHistoryService);

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.historyService.changeFilterDate(input.value || null);
  }
}
