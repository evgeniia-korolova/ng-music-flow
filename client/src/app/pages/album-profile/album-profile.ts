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
  public readonly albumStore = inject(AlbumStore);
  public readonly albumId = input.required<string>();

  constructor() {
    this.albumStore.loadAlbumDetails(this.albumId);
  }
}
