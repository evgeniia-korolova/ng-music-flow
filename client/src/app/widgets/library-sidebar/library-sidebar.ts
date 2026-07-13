import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LibraryPlaylist } from '../../entities/playlist/model/playlist.model';
import { TooltipDirective } from '../../shared/directives/tooltip';

@Component({
  selector: 'app-library-sidebar',
  imports: [Button, Icon, RouterLink, RouterLinkActive, TooltipDirective],
  templateUrl: './library-sidebar.html',
  styleUrl: './library-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibrarySidebar {
  readonly playlists = input.required<LibraryPlaylist[]>();
  //readonly openUserForm = output();
  readonly deletingListId = signal<string | null>(null);
  readonly checkedUserList = output<LibraryPlaylist>();
  readonly deleteUserList = output<LibraryPlaylist>();
}
