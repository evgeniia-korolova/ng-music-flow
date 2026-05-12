import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TracksStore } from '../../entities/track/model/track.store';

@Component({
  selector: 'app-tracks-list',
  imports: [],
  templateUrl: './tracks-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TracksList implements OnInit {
  readonly store = inject(TracksStore);

  ngOnInit(): void {
    this.store.loadTracks();
  }
}
