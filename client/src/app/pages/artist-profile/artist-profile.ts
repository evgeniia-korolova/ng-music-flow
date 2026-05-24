import { Component, inject, input, OnInit } from '@angular/core';
import { ArtistStore } from '../../entities/artist/model/artist.store';
import { ArtistCard } from '../../entities/artist/ui/artist-card/artist-card';

@Component({
  selector: 'app-artist-profile',
  imports: [ArtistCard],
  templateUrl: './artist-profile.html',
  styleUrl: './artist-profile.scss',
})
export default class ArtistProfile {
  public artistStore = inject(ArtistStore);
  public artistId = input.required<string>();

  constructor() {
    this.artistStore.loadArtistById(this.artistId);
  }
}
