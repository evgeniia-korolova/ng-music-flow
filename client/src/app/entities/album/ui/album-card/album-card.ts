import { Component, input } from '@angular/core';
import { Album } from '../../model/album.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-album-card',
  imports: [RouterLink],
  templateUrl: './album-card.html',
  styleUrl: './album-card.scss',
})
export class AlbumCard {
  public album = input.required<Album>();
  public isLink = input<boolean>(true);
}
