import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlaylistForm } from './create-playlist-form';
import { signal } from '@angular/core';
import { TracksStore } from '../../../entities/track/model/track.store';
import { Track } from '../../../entities/track/model/track.model';
const mockTrackStore = {
  tracks: signal([]),
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
  it('should emit playlist and reset form on submit', () => {
    let emittedData: unknown;
    component.savedPlayList.subscribe((data) => (emittedData = data));
    component.playlistForm.setValue({ title: 'My list', description: 'My desc' });
    component.selectedTracks.set([{ id: '1' } as unknown as Track]);
    component.onSubmit();
    expect(emittedData).toEqual({
      title: 'My list',
      descr: 'My desc',
      tracksList: [{ id: '1' } as unknown],
    });
    expect(component.playlistForm.value.title).toBeNull();
  });
});
