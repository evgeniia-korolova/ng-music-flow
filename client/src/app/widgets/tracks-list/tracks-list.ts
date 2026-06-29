import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
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

  constructor() {
    effect(() => {
      console.log(this.provider.tracks());
    });
  }

  readonly showWave = linkedSignal({
    source: () => ({
      mode: this.viewMode(),
      isLarge: this.screen.isLarge(),
      isMdTailwind: this.screen.isMdTailwind(),
    }),

    computation: (source) => {
      if (source.mode === 'slider') {
        return false;
      }

      if (source.mode === 'tabs' || source.mode === 'search') {
        return source.isLarge || source.isMdTailwind;
      }

      return false;
    },
  });
}
