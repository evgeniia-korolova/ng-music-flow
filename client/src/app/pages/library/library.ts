import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LibrarySidebar } from '../../widgets/library-sidebar/library-sidebar';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon.component';

import { RouterOutlet } from '@angular/router';
import { PlaylistsStore } from '../../entities/playlist/model/playlists.store';
import { LibraryPlaylist } from '../../entities/playlist/model/playlist-model.interface';

@Component({
  selector: 'app-library',
  imports: [LibrarySidebar, Button, Icon, RouterOutlet],
  templateUrl: './library.html',
  styleUrl: './library.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Library {
  readonly playlistsStore = inject(PlaylistsStore);

  readonly isFormShow = signal<boolean>(false);
  readonly saveCurrentList = signal<LibraryPlaylist | null>(null);
  readonly isSideBarOpen = signal<boolean>(false);

  // openCreateForm() {
  //   this.isFormShow.set(true);
  //   this.saveCurrentList.set(null);
  // }

  // onCreatePlayList(playlist: LibraryPlaylist) {
  //   this.playlists.update((data) => [...data, playlist]);
  // }

  public deletePlaylist(playlist: LibraryPlaylist): void {
    if (playlist.id) this.playlistsStore.deletePlaylist(playlist.id);
  }

  // deletePlaylist(playlistToDelete: LibraryPlaylist) {
  //   this.playlists.update((data) => data.filter((item) => item.name !== playlistToDelete.name));
  //   if (this.saveCurrentList()?.name === playlistToDelete.name) {
  //     this.saveCurrentList.set(null);
  //   }
  // }
}
