import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import { TracksStore } from '../../entities/track/model/track.store';
import { TRACK_DATA_PROVIDER } from '../../widgets/tracks-list/model/track-provider.token';
import { DISCOVER_TABS } from './models/tabs.config';
import { ResponsiveService } from '../../shared/services/responsive-service/responsive-service';

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
export default class Discover {
  protected readonly responsiveService = inject(ResponsiveService);
  protected readonly discoverTabs = DISCOVER_TABS;
}
