import { Injectable, signal } from '@angular/core';
import { Artist } from './artist.model';

@Injectable({ providedIn: 'root' })
export class ArtistStore {
  private mockData: Artist[] = [
    {
      id: '1',
      name: 'Anna Trincher',
      website: 'www',
      joinDate: '13.05.26',
      image: 'img',
      shortUrl: 'url',
      shareUrl: 'url',
    },
    {
      id: '2',
      name: 'Alyosha',
      website: 'www',
      joinDate: '12.05.26',
      image: 'img',
      shortUrl: 'url',
      shareUrl: 'url',
    },
  ];
  artists = signal<Artist[]>(this.mockData);
}
