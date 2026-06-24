import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon.component';
import { RouterLink } from '@angular/router';
import { TrackList } from '../../entities/playlist/model/playlist.model';

@Component({
  selector: 'app-library-sidebar',
  imports: [Button, Icon, RouterLink],
  templateUrl: './library-sidebar.html',
  styleUrl: './library-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibrarySidebar {
  readonly playlists = input.required<TrackList[]>();
  readonly openUserForm = output();
  readonly checkedUserList = output<TrackList>();
  readonly deleteUserList = output<TrackList>();
}
