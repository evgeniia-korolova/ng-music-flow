import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumsList } from './albums-list';
import { AlbumStore } from '../../entities/album/model/album.store';
import { signal } from '@angular/core';

describe('AlbumsList', () => {
  const mockAlbumStore = {
    items: signal([]),
    isLoading: signal(true),
    error: signal(null),
    loadAlbums: vi.fn(),
  };
  let component: AlbumsList;
  let fixture: ComponentFixture<AlbumsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumsList],
      providers: [{ provide: AlbumStore, useValue: mockAlbumStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumsList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('artistId', '123');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
