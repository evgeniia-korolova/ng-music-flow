import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-explore',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Explore {}
