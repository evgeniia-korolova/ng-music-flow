import { Component, inject, input } from '@angular/core';
import { ArtistStore } from '../../entities/artist/model/artist.store';
import { ArtistCard } from '../../entities/artist/ui/artist-card/artist-card';
import { AlbumsList } from '../../widgets/albums-list/albums-list';
import { TrackCard } from '../../entities/track/ui/track-card/track-card';

@Component({
  selector: 'app-artist-profile',
  imports: [ArtistCard, AlbumsList, TrackCard],
  templateUrl: './artist-profile.html',
  styleUrl: './artist-profile.scss',
})
export class ArtistProfile {
  protected artistStore = inject(ArtistStore);
  protected artistId = input.required<string>();

  constructor() {
    this.artistStore.loadArtistProfile(this.artistId);
  }
}
