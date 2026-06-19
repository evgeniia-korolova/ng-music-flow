import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Track } from '../../model/track.model';
import { TrackWaveform } from '../track-waveform/track-waveform';
import { AudioPlayerService } from '../../../../shared/services/audio-player/audio-player-service';
import { RouterLink } from '@angular/router';
import { CompactNumberPipe } from '../../../../shared/ui/pipes/compact-number-pipe';
import { DurationPipe } from '../../../../shared/ui/pipes/duration-pipe';
import { Icon } from '../../../../shared/ui/icon/icon.component';
import { NgOptimizedImage, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-track-card',
  imports: [
    RouterLink,
    CompactNumberPipe,
    DurationPipe,
    Icon,
    TitleCasePipe,
    TrackWaveform,
    NgOptimizedImage,
  ],
  templateUrl: './track-card.html',
  styleUrl: './track-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackCard {
  protected playerService = inject(AudioPlayerService);
  readonly track = input.required<Track>();
  readonly isPlaying = this.playerService.isPlaying;
  readonly showWave = input.required<boolean>();
  readonly playlistContext = input.required<Track[]>();
  readonly showExtraInfo = input<boolean>(true);

  readonly progress = computed(() => {
    if (!this.isCurrentTrack()) {
      return 0;
    }
    return this.playerService.progressPercent();
  });

  readonly isCurrentTrack = computed(
    () => this.playerService.currentTrack()?.id === this.track().id,
  );

  readonly isPlayingTrack = computed(() => this.isCurrentTrack() && this.playerService.isPlaying());

  play(track: Track): void {
    this.playerService.playTrack(track, this.playlistContext());
  }

  coverSrc = computed(() => {
    const url = this.track().coverUrl;
    if (!url) return '';

    return url.replace('width=300', 'width=100');
  });
}
