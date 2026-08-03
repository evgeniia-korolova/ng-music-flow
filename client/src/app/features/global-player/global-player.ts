import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Icon } from '../../shared/ui/icon/icon.component';
import { AudioPlayerService } from '../../shared/services/audio-player/audio-player-service';
import { TrackWaveform } from '../../entities/track/ui/track-waveform/track-waveform';
import { DurationPipe } from '../../shared/ui/pipes/duration-pipe';
import { TooltipDirective } from '../../shared/directives/tooltip';
import { ResponsiveService } from '../../shared/services/responsive-service/responsive-service';

@Component({
  selector: 'app-global-player',
  imports: [Icon, TitleCasePipe, TrackWaveform, DurationPipe, TooltipDirective],
  templateUrl: './global-player.html',
  styleUrl: './global-player.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-visible]': '!!currentTrack()',
    '[class.is-minimized]': 'isMobileOrTablet() && isPlayerMinimized()',
  },
})
export class GlobalPlayer {
  protected playerService = inject(AudioPlayerService);
  protected readonly responsiveService = inject(ResponsiveService);

  readonly currentTrack = this.playerService.currentTrack;
  readonly isPlaying = this.playerService.isPlaying;
  readonly progressPercent = this.playerService.progressPercent;

  readonly isQueueOpen = this.playerService.isQueueOpen;
  readonly queueTracks = this.playerService.queue;

  readonly isMobileOrTablet = computed(() => !this.responsiveService.isLarge());

  readonly isPlayerMinimized = this.playerService.isMinimized;

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.playerService.seekTo(Number(input.value));
  }

  toggleQueueMenu(): void {
    this.playerService.toggleQueue();
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.playerService.setVolume(Number(input.value));
  }

  handleWidgetClick(): void {
    this.playerService.maximize();
  }
}
