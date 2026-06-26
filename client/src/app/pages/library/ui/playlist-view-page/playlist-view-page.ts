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
  public readonly playlistsStore = inject(PlaylistsStore);

  public readonly name = input.required<string>();

  public readonly edit = input<string>('false');
  public readonly isEditing = computed(() => this.edit() === 'true');

  public readonly activePlaylist = computed(() => {
    return this.playlistsStore.playlists().find((p) => p.name === this.name());
  });

  onAddTrackClick() {
    console.log('not empty method for linter');
  }

  onSaveChangesClick(id: string | undefined) {
    console.log(id);
  }
}
