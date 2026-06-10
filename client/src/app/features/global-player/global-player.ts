import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Icon } from '../../shared/ui/icon/icon.component';
import { AudioPlayerService } from '../../shared/services/audio-player/audio-player-service';
import { TrackWaveform } from '../../entities/track/ui/track-waveform/track-waveform';
import { DurationPipe } from '../../shared/ui/pipes/duration-pipe';

@Component({
  selector: 'app-global-player',
  imports: [Icon, TitleCasePipe, TrackWaveform, DurationPipe],
  templateUrl: './global-player.html',
  styleUrl: './global-player.scss',
  host: {
    '[class.is-visible]': '!!currentTrack()',
  },
})
export class GlobalPlayer {
  protected playerService = inject(AudioPlayerService);

  readonly currentTrack = this.playerService.currentTrack;
  readonly isPlaying = this.playerService.isPlaying;
  readonly progressPercent = this.playerService.progressPercent;

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.playerService.seekTo(Number(input.value));
  }

  toggleQueueMenu(): void {
    console.log('Показать/скрыть шторку очереди треков');
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.playerService.setVolume(Number(input.value));
  }
}
