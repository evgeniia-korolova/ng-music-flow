import { Component, inject } from '@angular/core';
import { ArtistCard } from '../../entities/artist/ui/artist-card/artist-card';
import { ArtistStore } from '../../entities/artist/model/artist.store';

@Component({
  selector: 'app-artists-list',
  imports: [ArtistCard],
  templateUrl: './artists-list.html',
  styleUrl: './artists-list.scss',
})
export class ArtistsList {
  store = inject(ArtistStore);
}
