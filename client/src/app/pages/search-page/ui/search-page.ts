import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { SearchFilters } from '../../../features/ui/search-filters/search-filters';
import { SearchStore } from '../model/search.store';
import { TRACK_DATA_PROVIDER } from '../../../widgets/tracks-list/model/track-provider.token';
import TracksList from '../../../widgets/tracks-list/tracks-list';
import { ResponsiveService } from '../../../shared/services/responsive-service/responsive-service';
import { Icon } from '../../../shared/ui/icon/icon.component';
import { Button } from '../../../shared/ui/button/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search-page',
  imports: [SearchFilters, TracksList, Icon, Button],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TRACK_DATA_PROVIDER,
      useExisting: SearchStore,
    },
  ],
})
export default class SearchPage implements OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private location = inject(Location);
  protected readonly store = inject(SearchStore);
  protected readonly responsiveService = inject(ResponsiveService);

  protected isSidebarOpen = signal(false);

  readonly tags = input<string | undefined>();
  readonly sortBy = input<string | undefined>();
  readonly min = input<string | undefined>();
  readonly max = input<string | undefined>();

  constructor() {
    effect(() => {
      const params = new URLSearchParams();
      if (this.store.query()) params.set('q', this.store.query());
      if (this.store.filters().genres?.length)
        params.set('tags', this.store.filters().genres.join(','));
      if (this.store.filters().sortBy) params.set('sortBy', this.store.filters().sortBy);
      if (this.store.filters().durationMin)
        params.set('min', this.store.filters().durationMin.toString());
      if (this.store.filters().durationMax)
        params.set('max', this.store.filters().durationMax.toString());
      if (this.store.offset()) params.set('offset', this.store.offset().toString());

      const queryString = params.toString();
      const url = queryString
        ? `${this.router.url.split('?')[0]}?${queryString}`
        : this.router.url.split('?')[0];

      this.location.replaceState(url);
    });

    effect(() => {
      const isOpen = this.isSidebarOpen();

      const scrollContainer = document.body;

      if (scrollContainer) {
        if (isOpen) {
          scrollContainer.classList.add('no-scroll');
        } else {
          scrollContainer.classList.remove('no-scroll');
        }
      }
    });

    effect(() => {
      //this.store.filters();
      this.store.query();
      const offset = this.store.offset();
      if (offset !== 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen.update((state) => !state);
  }

  ngOnDestroy(): void {
    document.body.classList.remove('no-scroll');
  }

  onLoadMore(): void {
    this.store.loadMore();
  }
}
