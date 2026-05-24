import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GenreService } from '../../entities/genre/api/genre';
import { GenreCard } from '../../entities/genre/ui/genre-card/genre-card';

@Component({
  selector: 'app-genres',
  imports: [GenreCard],
  templateUrl: './genres.html',
  styleUrl: './genres.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Genres {
  genreService = inject(GenreService);

  genres = this.genreService.genres;
}
