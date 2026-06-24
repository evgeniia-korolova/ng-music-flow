import { ComponentFixture, TestBed } from '@angular/core/testing';

import Library from './library';
import { LibraryTrackList } from '../../entities/playlist/model/playlist.model';

describe('Library', () => {
  let component: Library;
  let fixture: ComponentFixture<Library>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Library],
    }).compileComponents();

    fixture = TestBed.createComponent(Library);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should add playlist to the list', () => {
    component.onCreatePlayList({ title: 'Rock' } as unknown as LibraryTrackList);
    expect(component.playlists().length).toEqual(1);
  });
  it('should delete playlist and clear current view', () => {
    const fakeList = { title: 'Pop' } as unknown as LibraryTrackList;
    component.playlists.set([fakeList]);
    component.saveCurrentList.set(fakeList);
    component.deletePlaylist(fakeList);
    expect(component.playlists().length).toEqual(0);
    expect(component.saveCurrentList()).toBeNull();
  });
});
