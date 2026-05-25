import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { SearchFilters } from '../../../features/ui/search-filters/search-filters';
import { SearchStore } from '../model/search.store';
import { TRACK_DATA_PROVIDER } from '../../../widgets/tracks-list/model/track-provider.token';
import TracksList from '../../../widgets/tracks-list/tracks-list';

@Component({
  selector: 'app-search-page',
  imports: [SearchFilters, TracksList],
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
export default class SearchPage {
  private readonly store = inject(SearchStore);

  readonly tags = input<string | undefined>();
  readonly sortBy = input<string | undefined>();
  readonly min = input<string | undefined>();
  readonly max = input<string | undefined>();

  constructor() {
    effect(() => {
      // const initialTag = this.tags();
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

    // if (initialTag && initialTag.trim()) {
    //   const cleanTag = initialTag.trim().toLowerCase() as GenreId;
    //   this.store.setInitialTagFromUrl(cleanTag);
    // }
  }
}
