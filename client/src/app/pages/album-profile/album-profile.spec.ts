import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumProfile } from './album-profile';
import { signal } from '@angular/core';
import { Album } from '../../entities/album/model/album.model';
import { AlbumStore } from '../../entities/album/model/album.store';

describe('AlbumProfile', () => {
  let component: AlbumProfile;
  let fixture: ComponentFixture<AlbumProfile>;
  const mockAlbumStore = {
    isLoading: signal(false),
    error: signal<string | null>(null),
    currentAlbum: signal<Album | null>(null),
    loadAlbumDetails: () => undefined,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumProfile],
      providers: [{ provide: AlbumStore, useValue: mockAlbumStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumProfile);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('albumId', '1');
    mockAlbumStore.isLoading.set(false);
    mockAlbumStore.error.set(null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display loading message', () => {
    mockAlbumStore.isLoading.set(true);
    fixture.detectChanges();
    const loadingtext = fixture.nativeElement.querySelector('.album-profile__loading');
    expect(loadingtext.textContent).toContain('loading');
  });
  it('should display error message', () => {
    mockAlbumStore.error.set('Something went wrong');
    fixture.detectChanges();
    const errorText = fixture.nativeElement.querySelector('.album-profile__error');
    expect(errorText.textContent).toContain('not found');
  });
  it('should display album details when currentAlbum is loaded', () => {
    const fakeAlbum = {
      id: '1',
      name: 'Test Album',
      images: [{ url: 'test.jpg' }],
      artists: [{ name: 'Test Artists' }],
      tracks: [],
    } as unknown as Album;
    mockAlbumStore.currentAlbum.set(fakeAlbum);
    fixture.detectChanges();
    const albumCard = fixture.nativeElement.querySelector('app-album-card');
    expect(albumCard).toBeTruthy();
  });
});
