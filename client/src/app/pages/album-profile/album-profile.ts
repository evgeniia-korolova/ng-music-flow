import { Component, inject, input } from '@angular/core';
import { AlbumStore } from '../../entities/album/model/album.store';
import { AlbumCard } from '../../entities/album/ui/album-card/album-card';
import { TrackCard } from '../../entities/track/ui/track-card/track-card';

@Component({
  selector: 'app-album-profile',
  imports: [AlbumCard, TrackCard],
  templateUrl: './album-profile.html',
  styleUrl: './album-profile.scss',
})
export class AlbumProfile {
  protected albumStore = inject(AlbumStore);
  protected albumId = input.required<string>();
  protected album = this.albumStore.currentAlbum;

  constructor() {
    this.albumStore.loadAlbumDetails(this.albumId);
  }
}
