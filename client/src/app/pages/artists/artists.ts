import { Component } from '@angular/core';
import { ArtistsList } from '../../widgets/artists-list/artists-list';

@Component({
  selector: 'app-artists',
  imports: [ArtistsList],
  templateUrl: './artists.html',
  styleUrl: './artists.scss',
})
export default class Artists {}
