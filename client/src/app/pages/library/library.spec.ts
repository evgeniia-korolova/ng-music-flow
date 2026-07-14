import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import Library from './library';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { PlaylistsStore } from '../../entities/playlist/model/playlists.store';

const mockPlaylistsStore = {
  playlists: signal([]),
  isLoading: signal(false),
  error: signal(null),
  loadPlaylists: vi.fn(),
  deletePlaylist: vi.fn(),
};

describe('Library', () => {
  let component: Library;
  let fixture: ComponentFixture<Library>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Library],
      providers: [provideRouter([]), { provide: PlaylistsStore, useValue: mockPlaylistsStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(Library);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should add playlist to the list', () => {
  //   component.onCreatePlayList({ title: 'Rock' } as unknown as LibraryTrackList);
  //   expect(component.playlists().length).toEqual(1);
  // });

  // it('should delete playlist and clear current view', () => {
  //   const fakeList = { title: 'Pop' } as unknown as LibraryTrackList;
  //   component.playlists.set([fakeList]);
  //   component.saveCurrentList.set(fakeList);
  //   component.deletePlaylist(fakeList);
  //   expect(component.playlists().length).toEqual(0);
  //   expect(component.saveCurrentList()).toBeNull();
  // });
});
