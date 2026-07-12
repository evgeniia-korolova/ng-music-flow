import { Component, inject, input } from '@angular/core';

import { Genre } from '../../model/genre.model';
import { Router } from '@angular/router';
import { SearchStore } from '../../../../pages/search-page/model/search.store';

@Component({
  selector: 'app-genre-card',
  imports: [],
  templateUrl: './genre-card.html',
  styleUrl: './genre-card.scss',
})
export class GenreCard {
  readonly genre = input.required<Genre>();
  protected readonly store = inject(SearchStore);
  private readonly router = inject(Router);

  onGenreClick(genreId: string): void {
    this.store.setGenre(genreId);
    this.router.navigateByUrl('/search');
  }
}
