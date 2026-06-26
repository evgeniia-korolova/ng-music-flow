import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CreatePlaylistForm } from '../../features/playlist/create-playlist-form/create-playlist-form';
import { LibrarySidebar } from '../../widgets/library-sidebar/library-sidebar';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon.component';
import { LibraryTrackList } from '../../entities/playlist/model/playlist.model';
import { UploadTrackForm } from '../../features/upload-track-form/upload-track-form';

@Component({
  selector: 'app-library',
  imports: [CreatePlaylistForm, LibrarySidebar, Button, Icon, UploadTrackForm],
  templateUrl: './library.html',
  styleUrl: './library.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Library {
  readonly playlists = signal<LibraryTrackList[]>([]);
  readonly isFormShow = signal<boolean>(false);
  readonly saveCurrentList = signal<LibraryTrackList | null>(null);
  readonly isSideBarOpen = signal<boolean>(false);

  openCreateForm() {
    this.isFormShow.set(true);
    this.saveCurrentList.set(null);
  }

  onCreatePlayList(playlist: LibraryTrackList) {
    this.playlists.update((data) => [...data, playlist]);
  }
  deletePlaylist(playlistToDelete: LibraryTrackList) {
    this.playlists.update((data) => data.filter((item) => item.title !== playlistToDelete.title));
    if (this.saveCurrentList()?.title === playlistToDelete.title) {
      this.saveCurrentList.set(null);
    }
  }
}
