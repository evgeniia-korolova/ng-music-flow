import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchToggleService {
  readonly isSearchBarVisible = signal(false);

  toggleSearchBar(): void {
    this.isSearchBarVisible.update((visible) => !visible);
  }

  openSearchBar(): void {
    this.isSearchBarVisible.set(true);
  }

  closeSearchBar(): void {
    this.isSearchBarVisible.set(false);
  }
}
