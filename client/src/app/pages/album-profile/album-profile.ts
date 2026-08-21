import { Component, effect, inject, input } from '@angular/core';
import { AlbumStore } from '../../entities/album/model/album.store';
import { AlbumCard } from '../../entities/album/ui/album-card/album-card';
import { TrackCard } from '../../entities/track/ui/track-card/track-card';
import { ScrollToTop } from '../../features/scroll-to-top/scroll-to-top';
import { AudioPlayerService } from '../../shared/services/audio-player/audio-player-service';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-album-profile',
  imports: [AlbumCard, TrackCard, ScrollToTop, Button],
  templateUrl: './album-profile.html',
  styleUrl: './album-profile.scss',
})
export class AlbumProfile {
  public readonly albumStore = inject(AlbumStore);
  public readonly audioPlayerService = inject(AudioPlayerService);
  public readonly albumId = input.required<string>();

  constructor() {
    effect(() => {
      this.albumStore.loadAlbumDetails(this.albumId());
    });
  }

  playFullAlbum() {
    const album = this.albumStore.currentAlbum();
    if (album && album.tracks && album.tracks.length > 0) {
      this.audioPlayerService.playTrack(album.tracks[0], album.tracks);
    }
  }
}
