import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistViewPage } from './playlist-view-page';
import { ComponentRef, signal } from '@angular/core';
import { PlaylistsStore } from '../../../../entities/playlist/model/playlists.store';
import { provideRouter, Router } from '@angular/router';
import { LibraryPlaylistTrack } from '../../../../entities/track/model/track.model';
import { LibraryPlaylist } from '../../../../entities/playlist/model/playlist.model';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

describe('PlaylistViewPage', () => {
  let component: PlaylistViewPage;
  let fixture: ComponentFixture<PlaylistViewPage>;
  let componentRef: ComponentRef<PlaylistViewPage>;

  const mockPlaylistsStore = {
    playlists: signal<LibraryPlaylist[]>([{ id: 'test-uuid-123', name: 'Chill Hits', tracks: [] }]),
    isLoading: signal(false),
    error: signal<string | null>(null),
    updateLocalPlaylistTracks: vi.fn(),
    updatePlaylist: vi.fn(),
  };

  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistViewPage],
      providers: [
        { provide: PlaylistsStore, useValue: mockPlaylistsStore },
        provideRouter([]),
        {
          provide: IMAGE_LOADER,
          useValue: (config: ImageLoaderConfig) => config.src || '/images/track-placeholder.jpg',
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistViewPage);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    vi.clearAllMocks();

    mockPlaylistsStore.playlists.set([{ id: 'test-uuid-123', name: 'Chill Hits', tracks: [] }]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should compute isEditing from input edit', () => {
    componentRef.setInput('edit', 'true');
    componentRef.setInput('playlistId', 'test-uuid-123');
    fixture.detectChanges();
    expect(component['isEditing']()).toBe(true);

    componentRef.setInput('edit', 'false');
    fixture.detectChanges();
    expect(component['isEditing']()).toBe(false);
  });

  it('should find active playlist by id from SignalStore', () => {
    componentRef.setInput('playlistId', 'test-uuid-123');

    fixture.detectChanges();

    const expectedPlaylist = { id: 'test-uuid-123', name: 'Chill Hits', tracks: [] };
    expect(component.activePlaylist()).toEqual(expectedPlaylist);
  });

  it('should return null, if there is no playlist with id in the store', () => {
    componentRef.setInput('playlistId', 'non-existent-id');

    fixture.detectChanges();

    expect(component.activePlaylist()).toBeNull();
  });

  it('shoul call store method updateLocalPlaylistTracks when tracks order is changed', () => {
    componentRef.setInput('playlistId', 'test-uuid-123');
    fixture.detectChanges();

    const dummyTrack: LibraryPlaylistTrack = {
      id: 'track-1',
      title: 'Test Track',
      duration: 180,
      artist: { id: 'a1', name: 'Artist' },
      album: { id: 'al1', name: 'Album' },
      coverUrl: 'images/track-placeholder.jpg',
      audioUrl: 'mock-audio.mp3',
      playCount: 0,
      rating: 5,
      waveform: [],
      releasedate: '2026-01-01',
      origin: 'LOCAL',
      order: 1,
    };

    const dummyTracks: LibraryPlaylistTrack[] = [dummyTrack];

    component['onTracksOrderChanged'](dummyTracks);

    expect(mockPlaylistsStore.updateLocalPlaylistTracks).toHaveBeenCalledWith(
      'test-uuid-123',
      dummyTracks,
    );
  });

  it('onSaveChangesClick (view mode): should change to edit mode via queryParams', () => {
    componentRef.setInput('playlistId', 'test-uuid-123');
    componentRef.setInput('edit', 'false');
    fixture.detectChanges();

    component['onSaveChangesClick']();

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: { edit: 'true' },
      queryParamsHandling: 'merge',
    });

    expect(mockPlaylistsStore.updatePlaylist).not.toHaveBeenCalled();
  });

  it('onSaveChangesClick (edit mode): should save changes to store and set edit mode to false', () => {
    const dummyTrack: LibraryPlaylistTrack = {
      id: 'track-1',
      title: 'Test Track',
      duration: 180,
      artist: { id: 'a1', name: 'Artist' },
      album: { id: 'al1', name: 'Album' },
      coverUrl: 'images/track-placeholder.jpg',
      audioUrl: 'mock-audio.mp3',
      playCount: 0,
      rating: 5,
      waveform: [],
      releasedate: '2026-01-01',
      origin: 'LOCAL',
      order: 1,
    };
    const mockPlaylistWithTracks: LibraryPlaylist = {
      id: 'test-uuid-123',
      name: 'Chill Hits',
      tracks: [dummyTrack],
    };
    mockPlaylistsStore.playlists.set([mockPlaylistWithTracks]);

    componentRef.setInput('playlistId', 'test-uuid-123');
    componentRef.setInput('edit', 'true');
    fixture.detectChanges();

    component['onSaveChangesClick']();

    expect(mockPlaylistsStore.updatePlaylist).toHaveBeenCalledWith({
      playlistId: 'test-uuid-123',
      playlistData: { tracks: mockPlaylistWithTracks.tracks },
    });

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: { edit: null },
      queryParamsHandling: 'merge',
    });
  });
});
