import { ComponentFixture, TestBed } from '@angular/core/testing';

import Artists from './artists';
import { signal } from '@angular/core';
import { ArtistStore } from '../../entities/artist/model/artist.store';

describe('Artists', () => {
  let mockArtistStore = {
    items: signal([]),
    isLoading: signal(false),
    error: signal(null),
    loadArtists: () => {},
  };
  let component: Artists;
  let fixture: ComponentFixture<Artists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Artists],
      providers: [{ provide: ArtistStore, useValue: mockArtistStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(Artists);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
