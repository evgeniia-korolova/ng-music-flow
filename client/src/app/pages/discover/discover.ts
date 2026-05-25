import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import { TracksStore } from '../../entities/track/model/track.store';
import { TRACK_DATA_PROVIDER } from '../../widgets/tracks-list/model/track-provider.token';

@Component({
  selector: 'app-discover',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './discover.html',
  styleUrl: './discover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TracksStore,
    {
      provide: TRACK_DATA_PROVIDER,
      useExisting: TracksStore,
    },
  ],
})
export default class Discover {}
