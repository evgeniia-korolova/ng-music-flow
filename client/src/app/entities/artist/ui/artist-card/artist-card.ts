import { Component, input } from '@angular/core';
import { Artist } from '../../model/artist.model';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-artist-card',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './artist-card.html',
  styleUrl: './artist-card.scss',
})
export class ArtistCard {
  public artist = input.required<Artist>();
  public isLink = input<boolean>(true);
}
