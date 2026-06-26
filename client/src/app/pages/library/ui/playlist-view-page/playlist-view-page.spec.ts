import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistViewPage } from './playlist-view-page';
import { signal } from '@angular/core';
import { PlaylistsStore } from '../../model/playlists.store';

describe('PlaylistViewPage', () => {
  let component: PlaylistViewPage;
  let fixture: ComponentFixture<PlaylistViewPage>;

  const mockPlaylistsStore = {
    playlists: signal([{ id: 'test-uuid-123', name: 'Chill Hits', tracks: [] }]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistViewPage],
      providers: [{ provide: PlaylistsStore, useValue: mockPlaylistsStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistViewPage);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('должен успешно принимать playlistId через input сигнал и вычислять activePlaylist', () => {
    fixture.componentRef.setInput('playlistId', 'test-uuid-123');

    fixture.detectChanges();

    expect(component['playlistId']()).toBe('test-uuid-123');

    expect(component.activePlaylist()).not.toBeNull();
    expect(component.activePlaylist()?.name).toBe('Chill Hits');
  });
});
