import { Component, signal } from '@angular/core';
import { Button } from '../../shared/ui/button/button';
import {
  CreatePlaylistForm,
  TrackList,
} from '../../features/playlist/create-playlist-form/create-playlist-form';

@Component({
  selector: 'app-library',
  imports: [Button, CreatePlaylistForm],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export default class Library {
  readonly isFormShow = signal<boolean>(false);
  readonly saveCurrentList = signal<TrackList | null>(null);

  openCreateForm() {
    this.isFormShow.set(true);
    this.saveCurrentList.set(null);
  }
  onCreatePlayList(playlist: TrackList) {
    console.log(playlist);
  }
}
