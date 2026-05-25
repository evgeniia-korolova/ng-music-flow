import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsList } from './artists-list';
import { signal } from '@angular/core';
import { ArtistStore } from '../../entities/artist/model/artist.store';

describe('ArtistsList', () => {
  let mockArtistStore = {
    items: signal([]),
    isLoading: signal(false),
    error: signal(null),
    loadArtists: () => {},
  };
  let component: ArtistsList;
  let fixture: ComponentFixture<ArtistsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistsList],
      providers: [{ provide: ArtistStore, useValue: mockArtistStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
