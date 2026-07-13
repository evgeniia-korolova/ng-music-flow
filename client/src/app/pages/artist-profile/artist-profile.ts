import { Component, effect, inject, input } from '@angular/core';
import { ArtistStore } from '../../entities/artist/model/artist.store';
import { ArtistCard } from '../../entities/artist/ui/artist-card/artist-card';
import { AlbumsList } from '../../widgets/albums-list/albums-list';
import { TrackCard } from '../../entities/track/ui/track-card/track-card';
import { Button } from '../../shared/ui/button/button';
import { ScrollToTop } from '../../features/scroll-to-top/scroll-to-top';

@Component({
  selector: 'app-artist-profile',
  imports: [ArtistCard, AlbumsList, TrackCard, Button, ScrollToTop],
  templateUrl: './artist-profile.html',
  styleUrl: './artist-profile.scss',
})
export class ArtistProfile {
  public readonly artistStore = inject(ArtistStore);
  public readonly artistId = input.required<string>();

  constructor() {
    effect(() => {
      this.artistStore.loadArtistProfile(this.artistId());
    });
  }

  onLoadMore() {
    this.artistStore.loadMoreTracks();
  }
}
