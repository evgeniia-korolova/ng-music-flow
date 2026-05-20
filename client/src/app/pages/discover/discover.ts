import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-discover',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './discover.html',
  styleUrl: './discover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Discover {}
