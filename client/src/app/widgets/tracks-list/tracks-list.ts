import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TracksStore } from '../../entities/track/model/track.store';
import { TrackCard } from '../../entities/track/ui/track-card/track-card';

@Component({
  selector: 'app-tracks-list',
  imports: [TrackCard],
  templateUrl: './tracks-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TracksList {
  readonly store = inject(TracksStore);
}
