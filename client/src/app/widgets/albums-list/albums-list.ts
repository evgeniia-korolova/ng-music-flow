import { Component, effect, inject, input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlbumStore } from '../../entities/album/model/album.store';
import { AlbumCard } from '../../entities/album/ui/album-card/album-card';
import { register } from 'swiper/element/bundle';
import { Album } from '../../entities/album/model/album.model';

register();

@Component({
  selector: 'app-albums-list',
  imports: [AlbumCard],
  templateUrl: './albums-list.html',
  styleUrl: './albums-list.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AlbumsList {
  public readonly albums = input.required<Album[]>();
  public isPagination = input<boolean>(true);
}
