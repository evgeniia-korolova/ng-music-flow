import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { SearchFilters } from '../../../features/ui/search-filters/search-filters';
import { SearchStore } from '../model/search.store';
import { GenreId } from '../model/search.model';

@Component({
  selector: 'app-search-page',
  imports: [SearchFilters],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SearchStore],
})
export default class SearchPage {
  private readonly store = inject(SearchStore);

  readonly tags = input<string | undefined>();

  constructor() {
    effect(() => {
      const initialTag = this.tags();
      if (initialTag && initialTag.trim()) {
        const cleanTag = initialTag.trim().toLowerCase() as GenreId;
        this.store.setInitialTagFromUrl(cleanTag);
      }
    });
  }
}
