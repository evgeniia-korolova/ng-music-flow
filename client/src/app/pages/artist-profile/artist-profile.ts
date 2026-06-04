import { Component, HostListener, inject, input, signal } from '@angular/core';
import { ArtistStore } from '../../entities/artist/model/artist.store';
import { ArtistCard } from '../../entities/artist/ui/artist-card/artist-card';
import { AlbumsList } from '../../widgets/albums-list/albums-list';
import { TrackCard } from '../../entities/track/ui/track-card/track-card';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-artist-profile',
  imports: [ArtistCard, AlbumsList, TrackCard, Button, Icon],
  templateUrl: './artist-profile.html',
  styleUrl: './artist-profile.scss',
})
export class ArtistProfile {
  protected artistStore = inject(ArtistStore);
  protected artistId = input.required<string>();

  isScrollButtonVisible = signal(false);

  constructor() {
    this.artistStore.loadArtistProfile(this.artistId);
  }

  onLoadMore() {
    this.artistStore.loadMoreTracks();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (window.scrollY > 200) {
      this.isScrollButtonVisible.set(true);
    } else {
      this.isScrollButtonVisible.set(false);
    }
  }
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
