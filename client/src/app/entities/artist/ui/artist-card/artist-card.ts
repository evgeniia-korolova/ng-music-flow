import { Component, input } from '@angular/core';
import { Artist } from '../../model/artist.model';

@Component({
  selector: 'app-artist-card',
  imports: [],
  templateUrl: './artist-card.html',
  styleUrl: './artist-card.scss',
})
export class ArtistCard {
  public artist = input.required<Artist>();
}
