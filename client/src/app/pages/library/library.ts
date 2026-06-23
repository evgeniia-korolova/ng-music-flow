import { Component, signal } from '@angular/core';
import { Button } from '../../shared/ui/button/button';
import {
  CreatePlaylistForm,
  TrackList,
} from '../../features/playlist/create-playlist-form/create-playlist-form';
import { Icon } from '../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-library',
  imports: [Button, CreatePlaylistForm, Icon],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export default class Library {
  readonly isFormShow = signal<boolean>(false);
  readonly saveCurrentList = signal<TrackList | null>(null);
  readonly playlists = signal<TrackList[]>([]);

  openCreateForm() {
    this.isFormShow.set(true);
    this.saveCurrentList.set(null);
  }
  onCreatePlayList(playlist: TrackList) {
    this.playlists.update((data) => [...data, playlist]);
  }
  deletePlaylist(playlistToDelete: TrackList) {
    this.playlists.update((data) => data.filter((item) => item.title !== playlistToDelete.title));
    if (this.saveCurrentList()?.title === playlistToDelete.title) {
      this.saveCurrentList.set(null);
    }
  }
}
