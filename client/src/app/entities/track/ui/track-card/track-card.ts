import { Component, inject, input } from '@angular/core';
import { Track } from '../../model/track.model';
import { TrackWaveform } from '../track-waveform/track-waveform';
import { AudioPlayerService } from '../../../../shared/api/audio-player-service';

@Component({
  selector: 'app-track-card',
  imports: [TrackWaveform],
  templateUrl: './track-card.html',
  styleUrl: './track-card.scss',
})
export class TrackCard {
  protected playerService = inject(AudioPlayerService);
  readonly track = input.required<Track>();
  readonly isPlaying = input<boolean>();

  onPlayClick(): void {
    this.playerService.playTrack(this.track());
  }

  isCurrentTrack(): boolean {
    return this.playerService.currentTrack()?.id === this.track().id;
  }
}
