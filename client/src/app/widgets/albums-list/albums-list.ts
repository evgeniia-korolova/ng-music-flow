import { Component, effect, inject, input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlbumStore } from '../../entities/album/model/album.store';
import { AlbumCard } from '../../entities/album/ui/album-card/album-card';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-albums-list',
  imports: [AlbumCard],
  templateUrl: './albums-list.html',
  styleUrl: './albums-list.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AlbumsList {
  protected readonly store = inject(AlbumStore);
  public readonly artistId = input.required<string>();
  public isPagination = input<boolean>(true);

  constructor() {
    effect(() => {
      this.store.loadAlbums(this.artistId());
    });
  }
}
