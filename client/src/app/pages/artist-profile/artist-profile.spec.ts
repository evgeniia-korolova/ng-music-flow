import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistProfile } from './artist-profile';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ArtistStore } from '../../entities/artist/model/artist.store';

describe('ArtistProfile', () => {
  const mockArtistStore = {
    isLoading: signal(false),
    error: signal<string | null>(null),
    currentArtist: signal({ id: '2', name: 'Viktor' }),
    albums: signal([]),
    tracks: signal([]),
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
  it('should display loading message', () => {
    mockArtistStore.isLoading.set(true);
    fixture.detectChanges();
    const loadingText = fixture.nativeElement.querySelector('.artist-profile__loading');
    expect(loadingText.textContent).toContain('loading');
  });
  it('should display error message', () => {
    mockArtistStore.isLoading.set(false);
    mockArtistStore.error.set('Something went wrong');
    fixture.detectChanges();
    const errorText = fixture.nativeElement.querySelector('.artist-profile__loading');
    expect(errorText.textContent).toContain('Oops!');
  });
  it('is show content', () => {
    mockArtistStore.isLoading.set(false);
    mockArtistStore.error.set(null);
    mockArtistStore.currentArtist.set({ id: '123', name: 'Test Artist' });
    fixture.detectChanges();
    const cart = fixture.nativeElement.querySelector('app-artist-card');
    expect(cart).toBeTruthy();
  });
  it('show load more', () => {
    mockArtistStore.hasMoreTracks.set(true);
    fixture.detectChanges();
    const loadMore = fixture.nativeElement.querySelector('app-button');
    expect(loadMore).toBeTruthy();
  });
});
