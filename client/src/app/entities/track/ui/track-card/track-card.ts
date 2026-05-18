import { Component, computed, inject, input } from '@angular/core';
import { Track } from '../../model/track.model';
import { TrackWaveform } from '../track-waveform/track-waveform';
import { AudioPlayerService } from '../../../../shared/services/audio-player/audio-player-service';
import { generateFakePeaks } from '../../../../shared/lib/waveform';

@Component({
  selector: 'app-track-card',
  imports: [TrackWaveform],
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

  readonly waveform = computed(() => {
    const duration = this.track().duration;

    const length = duration ? Math.floor(duration / 2) : 60;

    return generateFakePeaks(length);
  });

  readonly isCurrentTrack = computed(
    () => this.playerService.currentTrack()?.id === this.track().id,
  );

  play(track: Track): void {
    this.playerService.playTrack(track);
  }
}
