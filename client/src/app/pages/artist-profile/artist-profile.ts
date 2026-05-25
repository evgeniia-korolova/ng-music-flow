import { Component, inject, input } from '@angular/core';
import { ArtistStore } from '../../entities/artist/model/artist.store';
import { ArtistCard } from '../../entities/artist/ui/artist-card/artist-card';

@Component({
  selector: 'app-artist-profile',
  imports: [ArtistCard],
  templateUrl: './artist-profile.html',
  styleUrl: './artist-profile.scss',
})
export default class ArtistProfile {
  protected readonly artistStore = inject(ArtistStore);
  protected readonly artistId = input.required<string>();

  constructor() {
    this.artistStore.loadArtistById(this.artistId);
  }
}
