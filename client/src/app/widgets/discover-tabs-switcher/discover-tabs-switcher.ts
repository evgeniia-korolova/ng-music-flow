import { ChangeDetectionStrategy, Component, inject, input, OnChanges } from '@angular/core';
import { TracksStore } from '../../entities/track/model/track.store';
import TracksList from '../tracks-list/tracks-list';

@Component({
  selector: 'app-discover-tabs-switcher',
  imports: [TracksList],
  templateUrl: './discover-tabs-switcher.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DiscoverTabsSwitcher implements OnChanges {
  private readonly store = inject(TracksStore);

  readonly order = input.required<string>();
  readonly pageTitle = input<string>('');

  ngOnChanges(): void {
    if (this.pageTitle()) {
      this.store.setListTitle(this.pageTitle());
    }

    const orderType = this.order();

    this.store.loadTracks({ order: orderType, limit: 30 });
  }
}
