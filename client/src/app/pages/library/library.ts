import { Component, signal } from '@angular/core';
import {
  CreatePlaylistForm,
  TrackList,
} from '../../features/playlist/create-playlist-form/create-playlist-form';
import { LibrarySidebar } from '../../widgets/library-sidebar/library-sidebar';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-library',
  imports: [CreatePlaylistForm, LibrarySidebar, Button, Icon],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export default class Library {
  readonly playlists = signal<TrackList[]>([]);
  readonly isFormShow = signal<boolean>(false);
  readonly saveCurrentList = signal<TrackList | null>(null);
  readonly isSideBarOpen = signal<boolean>(false);

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
