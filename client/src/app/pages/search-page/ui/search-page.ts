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

@Component({
  selector: 'app-search-page',
  imports: [SearchFilters, TracksList, Icon, Button],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SearchStore,
    {
      provide: TRACK_DATA_PROVIDER,
      useExisting: SearchStore,
    },
  ],
})
export default class SearchPage implements OnDestroy {
  protected readonly store = inject(SearchStore);
  protected readonly responsiveService = inject(ResponsiveService);

  protected isSidebarOpen = signal(false);

  readonly tags = input<string | undefined>();
  readonly sortBy = input<string | undefined>();
  readonly min = input<string | undefined>();
  readonly max = input<string | undefined>();

  constructor() {
    effect(() => {
      const tagsValue = this.tags();
      const sortByValue = this.sortBy();
      const minValue = this.min();
      const maxValue = this.max();

      this.store.setFiltersFromUrl({
        tags: tagsValue,
        sortBy: sortByValue,
        min: minValue ? +minValue : undefined,
        max: maxValue ? +maxValue : undefined,
      });
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
