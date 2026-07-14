import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlaylistForm } from './create-playlist-form';
import { signal } from '@angular/core';
import { TracksStore } from '../../../entities/track/model/track.store';
import { of } from 'rxjs';
import { LibraryPlaylist } from '../../../entities/playlist/model/playlist.model';
import { Track } from '../../../entities/track/model/track.model';
import { vi } from 'vitest';
import { PlaylistsStore } from '../../../entities/playlist/model/playlists.store';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { TrackApiService } from '../../../entities/track/api/track-api-service';

const mockTrackStore = {
  tracks: signal<Track[]>([]),
  isLoading: signal(false),
  loadTracks: () => {
    /* mock */
  },
};

const mockPlaylistsStore = {
  playlists: signal<LibraryPlaylist[]>([]),
  isLoading: signal(false),
  error: signal<string | null>(null),
  loadPlaylists: () => {
    /* mock */
  },
  createPlaylist: vi.fn(),
  updatePlaylist: vi.fn(),
};

const mockTrackApiService = {
  getUserTracks: () => of({ data: { tracks: [] } }),
};

describe('CreatePlaylistForm', () => {
  let component: CreatePlaylistForm;
  let fixture: ComponentFixture<CreatePlaylistForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlaylistForm],

      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: TrackApiService, useValue: mockTrackApiService },
      ],
    })

      .overrideComponent(CreatePlaylistForm, {
        set: {
          providers: [
            { provide: TracksStore, useValue: mockTrackStore },
            { provide: PlaylistsStore, useValue: mockPlaylistsStore },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CreatePlaylistForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should emit playlist and reset form on submit', () => {
  //   let emittedData: unknown;
  //   component.savedPlayList.subscribe((data) => (emittedData = data));
  //   component.playlistForm.setValue({ name: 'My list', description: 'My desc' });
  //   component.selectedTracks.set([{ id: '1' } as unknown as Track]);
  //   component.onSubmit();

  //   expect(emittedData).toEqual({
  //     name: 'My list',
  //     description: 'My desc',
  //     tracks: [{ id: '1' } as unknown],
  //   });
  //   expect(component.playlistForm.value.name).toBeNull();
  // });

  // it('should call createPlaylist, navigate to custom tracks and reset form on submit', async () => {

  //   const router = TestBed.inject(Router);
  //   const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

  //   const createPlaylistSpy = vi
  //     .spyOn(component.playlistsStore, 'createPlaylist')
  //     .mockResolvedValue({ name: 'My list', description: 'My desc', tracks: [] });

  //   component.playlistForm.setValue({ name: 'My list', description: 'My desc' });
  //   component.selectedTracks.set([{ id: '1' } as Track]);

  //   await component.onSubmit();

  //   expect(createPlaylistSpy).toHaveBeenCalledWith({
  //     name: 'My list',
  //     description: 'My desc',
  //     tracks: [{ id: '1' } as Track],
  //   });

  //   expect(navigateSpy).toHaveBeenCalledWith(['/library/custom-tracks']);

  //   expect(component.playlistForm.value.name).toBeNull();
  //   expect(component.selectedTracks().length).toBe(0);
  // });
});
