import { Component } from '@angular/core';
import { TracksList } from '../../widgets/tracks-list/tracks-list';

@Component({
  selector: 'app-home',
  imports: [TracksList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export default class Home {}
