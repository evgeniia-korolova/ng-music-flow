import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TrackCard } from '../../entities/track/ui/track-card/track-card';
import { TRACK_DATA_PROVIDER } from './model/track-provider.token';

@Component({
  selector: 'app-tracks-list',
  imports: [TrackCard],
  templateUrl: './tracks-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TracksList {
  protected readonly provider = inject(TRACK_DATA_PROVIDER);
}
