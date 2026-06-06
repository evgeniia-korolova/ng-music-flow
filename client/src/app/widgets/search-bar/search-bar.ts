import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchStore } from '../../pages/search-page/model/search.store';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  protected search = signal('');

  private readonly router = inject(Router);
  private store = inject(SearchStore);

  // onChange(value: string): void {
  //   this.search.set(value);

  //   this.router.navigate(['/search'], {
  //     queryParams: {
  //       q: value || null,
  //     },
  //     replaceUrl: true,
  //   });
  // }

  onChange(value: string) {
    this.search.set(value);
    this.store.setQuery(value);
    //this.store.resetOffset();
    this.router.navigate(['/search']);
  }
}
