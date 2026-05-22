import { Injectable } from '@angular/core';
import { Genre, GENRES_DATA } from '../model/genre.model';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  readonly genres: readonly Genre[] = GENRES_DATA;
}
