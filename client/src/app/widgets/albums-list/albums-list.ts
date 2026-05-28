import { Component, effect, inject, input } from '@angular/core';
import { AlbumStore } from '../../entities/album/model/album.store';
import { AlbumCard } from '../../entities/album/ui/album-card/album-card';

@Component({
  selector: 'app-albums-list',
  imports: [AlbumCard],
  templateUrl: './albums-list.html',
  styleUrl: './albums-list.scss',
})
export class AlbumsList {
  protected readonly store = inject(AlbumStore);
  public readonly artistId = input.required<string>();
  constructor() {
    effect(() => {
      this.store.loadAlbums(this.artistId());
    });
  }
}
