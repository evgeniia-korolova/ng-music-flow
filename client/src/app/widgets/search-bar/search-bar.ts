import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchStore } from '../../pages/search-page/model/search.store';
import { Icon } from '../../shared/ui/icon/icon.component';
import { debounce, form, FormField } from '@angular/forms/signals';

interface SearchFormData {
  query: string;
}

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, Icon, FormField],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar implements OnInit {
  private readonly router = inject(Router);
  private readonly store = inject(SearchStore);

  private readonly searchModel = signal<SearchFormData>({ query: '' });

  protected readonly searchForm = form(this.searchModel, (schemaPath) => {
    debounce(schemaPath.query, 300);
  });

  constructor() {
    effect(() => {
      const finalValue = this.searchForm.query().value;
      this.store.setQuery(finalValue());
    });

    effect(() => {
      const query = this.store.query();

      if (!query.trim()) {
        return;
      }

      this.navigateToSearch();
    });
  }

  ngOnInit(): void {
    const currentQuery = this.store.query();
    if (currentQuery) {
      this.searchModel.set({ query: currentQuery });
    }
  }

  protected navigateToSearch(): void {
    if (this.router.url !== '/search') {
      this.router.navigateByUrl('/search');
    }
  }

  protected clearSearch(): void {
    this.searchModel.set({ query: '' });
  }
}
