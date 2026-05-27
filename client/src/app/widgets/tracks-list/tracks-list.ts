import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { TrackCard } from '../../entities/track/ui/track-card/track-card';
import { TRACK_DATA_PROVIDER } from './model/track-provider.token';
import { ResponsiveService } from '../../shared/services/responsive-service/responsive-service';

@Component({
  selector: 'app-tracks-list',
  imports: [TrackCard],
  templateUrl: './tracks-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TracksList {
  protected readonly provider = inject(TRACK_DATA_PROVIDER);
  private screen = inject(ResponsiveService);
  readonly viewMode = input.required<'tabs' | 'search' | 'slider'>();
  readonly showWave = linkedSignal({
    source: () => ({
      mode: this.viewMode(),
      isLarge: this.screen.isLarge(),
      isMedium: this.screen.isMedium(),
    }),

    computation: (source) => {
      if (source.mode === 'tabs') {
        return source.isLarge || source.isMedium;
      }
      if (source.mode === 'search') {
        return source.isLarge;
      }
      return false;
    },
  });
}
