import { Component, computed, inject, input } from '@angular/core';
import { Track } from '../../model/track.model';
import { TrackWaveform } from '../track-waveform/track-waveform';
import { AudioPlayerService } from '../../../../shared/services/audio-player/audio-player-service';
import { RouterLink } from '@angular/router';
import { CompactNumberPipe } from '../../../../shared/ui/pipes/compact-number-pipe';
import { DurationPipe } from '../../../../shared/ui/pipes/duration-pipe';

@Component({
  selector: 'app-track-card',
  imports: [TrackWaveform, RouterLink, CompactNumberPipe, DurationPipe],
  templateUrl: './track-card.html',
  styleUrl: './track-card.scss',
})
export class TrackCard {
  protected playerService = inject(AudioPlayerService);
  readonly track = input.required<Track>();
  readonly isPlaying = this.playerService.isPlaying;

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
    this.playerService.playTrack(track);
  }
}
