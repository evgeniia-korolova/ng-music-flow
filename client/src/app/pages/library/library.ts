import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LibrarySidebar } from '../../widgets/library-sidebar/library-sidebar';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon.component';
import { LibraryPlaylist } from '../../entities/playlist/model/playlist.model';
import { Router, RouterOutlet } from '@angular/router';
import { PlaylistsStore } from '../../entities/playlist/model/playlists.store';

@Component({
  selector: 'app-library',
  imports: [LibrarySidebar, Button, Icon, RouterOutlet],
  templateUrl: './library.html',
  styleUrl: './library.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Library {
  readonly playlistsStore = inject(PlaylistsStore);
  readonly router = inject(Router);

  readonly isFormShow = signal<boolean>(false);
  readonly saveCurrentList = signal<LibraryPlaylist | null>(null);
  readonly isSideBarOpen = signal<boolean>(false);

  // openCreateForm() {
  //   this.isFormShow.set(true);
  //   this.saveCurrentList.set(null);
  // }

  public deletePlaylist(playlist: LibraryPlaylist): void {
    const deletedId = playlist.id;
    if (!deletedId) return;
    if (playlist.id) this.playlistsStore.deletePlaylist(playlist.id);

    const currentUrl = this.router.url;
    const isViewingDeleted = currentUrl.includes(`/library/playlists/${deletedId}`);

    if (!isViewingDeleted) return;

    const remainingPlaylists = this.playlistsStore.playlists().filter((p) => p.id !== deletedId);

    if (remainingPlaylists.length > 0) {
      void this.router.navigate(['/library/playlists', remainingPlaylists[0].id]);
    } else {
      void this.router.navigate(['/library/history']);
    }
  }
}
