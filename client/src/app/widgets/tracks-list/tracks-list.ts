import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  inject,
  input,
  linkedSignal,
  TemplateRef,
} from '@angular/core';
import { TrackCard } from '../../entities/track/ui/track-card/track-card';
import { TRACK_DATA_PROVIDER } from './model/track-provider.token';
import { ResponsiveService } from '../../shared/services/responsive-service/responsive-service';
import { Track } from '../../entities/track/model/track.model';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-tracks-list',
  imports: [TrackCard, NgTemplateOutlet],
  templateUrl: './tracks-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TracksList {
  protected readonly provider = inject(TRACK_DATA_PROVIDER);
  private screen = inject(ResponsiveService);
  readonly viewMode = input.required<'tabs' | 'search' | 'slider'>();
  protected readonly trackHeaderTemplate =
    contentChild<TemplateRef<{ $implicit: Track; index: number }>>('trackHeader');

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
