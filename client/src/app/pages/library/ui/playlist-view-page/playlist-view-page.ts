import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PlaylistsStore } from '../../../../entities/playlist/model/playlists.store';
import { DragDropList } from '../../../../widgets/drag-drop-list/drag-drop-list';
import { DatePipe } from '@angular/common';
import { Button } from '../../../../shared/ui/button/button';
import { Router, RouterLink } from '@angular/router';
import { LibraryPlaylistTrack } from '../../../../entities/playlist/model/playlist-model.interface';

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
    const playlist = this.activePlaylist();

    if (!this.isEditing()) {
      void this.router.navigate([], {
        queryParams: { edit: 'true' },
        queryParamsHandling: 'merge',
      });
    } else {
      if (playlist && playlist.tracks) {
        const updatePayload = {
          tracks: playlist.tracks.map((t, index) => ({
            trackId: t.id,
            origin: t.origin || 'JAMENDO',
            order: t.order || index + 1,
          })),
        };

        console.log('Syncing new drag&drop order with backend:', updatePayload);

        this.playlistsStore
          .updatePlaylist(id, updatePayload)
          .then(() => {
            console.log('New track order successfully saved to Supabase!');

            void this.router.navigate([], {
              queryParams: { edit: null },
              queryParamsHandling: 'merge',
            });
          })
          .catch((err) => {
            console.error('Failed to save track order on backend:', err);
          });
      }
    }
  }
}
