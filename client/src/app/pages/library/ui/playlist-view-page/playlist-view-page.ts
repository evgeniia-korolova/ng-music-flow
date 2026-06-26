import { Component, computed, inject, input } from '@angular/core';
import { PlaylistsStore } from '../../model/playlists.store';
import { DragDropList } from '../../../../widgets/drag-drop-list/drag-drop-list';
import { DatePipe } from '@angular/common';
import { Button } from '../../../../shared/ui/button/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-playlist-view-page',
  imports: [DragDropList, DatePipe, Button, RouterLink],
  templateUrl: './playlist-view-page.html',
  styleUrl: './playlist-view-page.scss',
})
export class PlaylistViewPage {
  protected readonly playlistsStore = inject(PlaylistsStore);

  protected readonly playlistId = input.required<string>();

  protected readonly edit = input<string>('false');
  protected readonly isEditing = computed(() => this.edit() === 'true');

  public readonly activePlaylist = computed(() => {
    const id = this.playlistId();
    const list = this.playlistsStore.playlists();
    // Ищем совпадение по UUID
    return list.find((p) => p.id === id) ?? null;
    // return this.playlistsStore.playlists().find((p) => p.id === this.playlistId());
  });

  onAddTrackClick() {
    console.log('not empty method for linter');
  }

  onSaveChangesClick(id: string | undefined) {
    console.log(id);
  }
}
