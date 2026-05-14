import { computed, Injectable, signal } from '@angular/core';
import { Track } from '../../entities/track/model/track.model';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private readonly audio = new Audio();

  readonly currentTrack = signal<Track | null>(null);
  readonly isPlaying = signal<boolean>(false);
  readonly isReady = signal<boolean>(false);
  readonly isBuffering = signal<boolean>(false);

  readonly currentTime = signal<number>(0);
  readonly duration = signal<number>(0);

  readonly progressPercent = computed(() => {
    const duration = this.duration();

    if (!duration) {
      return 0;
    }

    return (this.currentTime() / duration) * 100;
  });

  constructor() {
    this.initializeAudioEvents();
  }

  playTrack(track: Track): void {
    const activeTrack = this.currentTrack();

    if (activeTrack?.id === track.id) {
      this.togglePlayback();

      return;
    }

    this.loadTrack(track);
  }

  pause(): void {
    this.audio.pause();
  }

  resume(): void {
    void this.audio.play();
  }

  togglePlayback(): void {
    if (this.isPlaying()) {
      this.pause();

      return;
    }

    this.resume();
  }

  seekTo(percent: number): void {
    const duration = this.duration();

    if (!duration) {
      return;
    }

    this.audio.currentTime = (percent / 100) * duration;
  }

  private loadTrack(track: Track): void {
    this.resetPlayerState();

    this.currentTrack.set(track);

    this.audio.src = track.audio;
    this.audio.load();

    void this.audio.play();
  }

  private initializeAudioEvents(): void {
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audio.duration);
      this.isReady.set(true);
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audio.currentTime);
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying.set(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying.set(false);
    });

    this.audio.addEventListener('waiting', () => {
      this.isBuffering.set(true);
    });

    this.audio.addEventListener('playing', () => {
      this.isBuffering.set(false);
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
      this.currentTime.set(0);
    });
  }

  private resetPlayerState(): void {
    this.isReady.set(false);
    this.isBuffering.set(false);

    this.currentTime.set(0);
    this.duration.set(0);
  }
}
