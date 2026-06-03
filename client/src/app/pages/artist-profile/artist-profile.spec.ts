import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistProfile } from './artist-profile';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ArtistStore } from '../../entities/artist/model/artist.store';

describe('ArtistProfile', () => {
  const mockArtistStore = {
    isLoading: signal(false),
    error: signal(null),
    currentArtist: signal({ id: '2', name: 'Viktor' }),
    albums: signal([]),
    tracks: signal([]),
    loadMoreTracks: () => {},
    loadArtistProfile: () => {
      /*Test*/
    },

    hasMoreTracks: signal(true),
  };
  let component: ArtistProfile;
  let fixture: ComponentFixture<ArtistProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistProfile],
      providers: [provideRouter([]), { provide: ArtistStore, useValue: mockArtistStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistProfile);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('artistId', '1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
