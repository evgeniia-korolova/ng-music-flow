import { Component, input, output } from '@angular/core';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon.component';
import { TrackList } from '../../features/playlist/create-playlist-form/create-playlist-form';

@Component({
  selector: 'app-library-sidebar',
  imports: [Button, Icon],
  templateUrl: './library-sidebar.html',
  styleUrl: './library-sidebar.scss',
})
export class LibrarySidebar {
  readonly playlists = input.required<TrackList[]>();
  readonly openUserForm = output();
  readonly checkedUserList = output<TrackList>();
  readonly deleteUserList = output<TrackList>();
}
