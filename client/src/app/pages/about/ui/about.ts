import { Component } from '@angular/core';
import { TEAM_MEMBERS } from '../model/about.data';
import { TeamMember } from '../model/about.model';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  teamMembers: TeamMember[] = TEAM_MEMBERS;
}
