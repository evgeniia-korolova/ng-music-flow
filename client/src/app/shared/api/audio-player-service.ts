import { computed, Injectable, signal } from '@angular/core';
import { Track } from '../../entities/track/model/track.model';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  readonly audio = new Audio();

  readonly currentTrack = signal<Track | null>(null);
  readonly isPlaying = signal<boolean>(false);
  readonly currentTime = signal<number>(0);
  readonly duration = signal<number>(0);

  readonly progress = computed(() => {
    const total = this.duration();
    return total > 0 ? this.currentTime() : 0;
  });

  constructor() {
    this.audio.addEventListener('timeupdate', () => this.currentTime.set(this.audio.currentTime));
    this.audio.addEventListener('durationchange', () =>
      this.duration.set(this.audio.duration || 0),
    );
    this.audio.addEventListener('ended', () => this.handleTrackEnded());
  }

  playTrack(track: Track): void {
    if (this.currentTrack()?.id === track.id) {
      this.togglePlayback();
    } else {
      this.currentTrack.set(track);
      this.audio.src = track.audio;
      this.audio.load();
      this.audio.play();
      this.isPlaying.set(true);
    }
  }

  togglePlayback(): void {
    if (!this.currentTrack()) return;

    if (this.isPlaying()) {
      this.audio.pause();
      this.isPlaying.set(false);
    } else {
      this.audio.play();
      this.isPlaying.set(true);
    }
  }

  seek(seconds: number): void {
    if (!this.currentTrack()) return;
    this.audio.currentTime = seconds;
  }

  private handleTrackEnded() {
    this.isPlaying.set(false);
    this.currentTime.set(0);
  }
}
