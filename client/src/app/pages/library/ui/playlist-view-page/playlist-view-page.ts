import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PlaylistsStore } from '../../../../entities/playlist/model/playlists.store';
import { DragDropList } from '../../../../widgets/drag-drop-list/drag-drop-list';
import { DatePipe } from '@angular/common';
import { Button } from '../../../../shared/ui/button/button';
import { Router, RouterLink } from '@angular/router';
import { LibraryPlaylistTrack } from '../../../../entities/track/model/track.model';

@Component({
  selector: 'app-playlist-view-page',
  imports: [DragDropList, DatePipe, Button, RouterLink],
  templateUrl: './playlist-view-page.html',
  styleUrl: './playlist-view-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistViewPage {
  protected readonly playlistsStore = inject(PlaylistsStore);
  private readonly router = inject(Router);

  protected readonly playlistId = input.required<string>();

  protected readonly edit = input<string>('false');
  protected readonly isEditing = computed(() => this.edit() === 'true');

  public readonly activePlaylist = computed(() => {
    const id = this.playlistId();
    const list = this.playlistsStore.playlists();
    return list.find((p) => p.id === id) ?? null;
  });

  protected onTracksOrderChanged(updatedTracks: LibraryPlaylistTrack[]): void {
    this.playlistsStore.updateLocalPlaylistTracks(this.playlistId(), updatedTracks);
  }

  onAddTrackClick() {
    console.log('not empty method for linter');
  }

  protected onSaveChangesClick(): void {
    const id = this.playlistId();

    if (!this.isEditing()) {
      void this.router.navigate([], {
        queryParams: { edit: 'true' },
        queryParamsHandling: 'merge',
      });
    } else {
      console.log('Saving changes for playlist:', id);

      void this.router.navigate([], {
        queryParams: { edit: null },
        queryParamsHandling: 'merge',
      });
    }
  }
}
