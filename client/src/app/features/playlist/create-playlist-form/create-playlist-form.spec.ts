import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlaylistForm } from './create-playlist-form';
import { signal } from '@angular/core';
import { TracksStore } from '../../../entities/track/model/track.store';
// import { Track } from '../../../entities/track/model/track.model';
// import { vi } from 'vitest';
// import { Router } from '@angular/router';
const mockTrackStore = {
  tracks: signal([]),
  isLoading: signal(false),
  loadTracks: () => {
    /* mock */
  },
};
describe('CreatePlaylistForm', () => {
  let component: CreatePlaylistForm;
  let fixture: ComponentFixture<CreatePlaylistForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlaylistForm],
    })
      .overrideComponent(CreatePlaylistForm, {
        set: {
          providers: [{ provide: TracksStore, useValue: mockTrackStore }],
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
