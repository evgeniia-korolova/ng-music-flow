import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink, Router, NavigationEnd } from '@angular/router';
import { TracksStore } from '../../entities/track/model/track.store';
import { TRACK_DATA_PROVIDER } from '../../widgets/tracks-list/model/track-provider.token';
import { DISCOVER_TABS } from './models/tabs.config';
import { ResponsiveService } from '../../shared/services/responsive-service/responsive-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

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
  private router = inject(Router);

  activeRouteTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }

        return route.snapshot.data['pageTitle'] as string | undefined;
      }),
    ),
    { initialValue: 'Popular Tracks' },
  );
}
