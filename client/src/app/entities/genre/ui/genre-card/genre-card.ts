import { Component, input } from '@angular/core';

import { Genre } from '../../model/genre.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-genre-card',
  imports: [RouterLink],
  templateUrl: './genre-card.html',
  styleUrl: './genre-card.scss',
})
export class GenreCard {
  genre = input.required<Genre>();
}
