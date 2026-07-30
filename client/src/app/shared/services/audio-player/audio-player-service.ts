import { computed, inject, Injectable, signal } from '@angular/core';
import { Track } from '../../../entities/track/model/track.model';
import { HistoryStore } from '../../../features/tracks-history/model/track-history.store';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private readonly audio = new Audio();
  private readonly historyStore = inject(HistoryStore);

  readonly currentTrack = signal<Track | null>(null);
  readonly isPlaying = signal<boolean>(false);
  readonly isReady = signal<boolean>(false);
  readonly isBuffering = signal<boolean>(false);

  readonly currentTime = signal<number>(0);
  readonly duration = signal<number>(0);

  readonly queue = signal<Track[]>([]);

  readonly volume = signal<number>(0.7);
  private preMuteVolume = 0.7;

  readonly isMinimized = signal<boolean>(false);

  private isTrackLoggedToHistory = false;

  readonly currentTrackIndex = computed(() => {
    const track = this.currentTrack();
    if (!track) return -1;
    return this.queue().findIndex((t) => t.id === track.id);
  });

  readonly hasPrevious = computed(() => this.currentTrackIndex() > 0);

  readonly hasNext = computed(() => {
    const index = this.currentTrackIndex();
    return index >= 0 && index < this.queue().length - 1;
  });

  progressPercent = computed(() => {
    const time = this.currentTime();
    const duration = this.duration();

    if (!Number.isFinite(duration) || duration <= 0) {
      return 0;
    }

    return Math.min(100, (time / duration) * 100);
  });

  constructor() {
    this.initializeAudioEvents();
  }

  minimize(): void {
    this.isMinimized.set(true);
  }

  maximize(): void {
    this.isMinimized.set(false);
  }

  toggleLayout(): void {
    this.isMinimized.update((state) => !state);
  }

  playTrack(track: Track, customQueue?: Track[]): void {
    if (customQueue && customQueue.length > 0) {
      this.queue.set(customQueue);
    } else if (this.queue().length === 0 || !this.queue().some((t) => t.id === track.id)) {
      this.queue.set([track]);
    }

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

    this.isTrackLoggedToHistory = false;

    this.currentTrack.set(track);

    this.audio.src = track.audioUrl;
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

      if (this.isPlaying() && !this.isTrackLoggedToHistory) {
        const currentSeconds = this.audio.currentTime;
        const totalDuration = this.audio.duration;

        const isPastThirtySeconds = currentSeconds >= 30;
        const isPastHalfTrack = totalDuration > 0 && currentSeconds >= totalDuration / 2;

        if (isPastThirtySeconds || isPastHalfTrack) {
          const trackToSend = this.currentTrack();
          if (trackToSend) {
            this.isTrackLoggedToHistory = true;
            const trackOrigin: 'JAMENDO' | 'LOCAL' = trackToSend.audioUrl?.includes('jamendo')
              ? 'JAMENDO'
              : 'LOCAL';

            console.log(
              `Track "${trackToSend.title}" qualified for history (${trackOrigin}). Sending to backend...`,
            );

            this.historyStore.addTrackToHistory({
              ...trackToSend,
              origin: trackOrigin,
              order: 1,
            });
          }
        }
      }
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

      if (this.hasNext()) {
        this.next();
      } else {
        this.resetPlayerState();
      }
    });
  }

  next(): void {
    if (this.hasNext()) {
      const nextTrack = this.queue()[this.currentTrackIndex() + 1];
      this.loadTrack(nextTrack);
    }
  }

  previous(): void {
    if (this.hasPrevious()) {
      const prevTrack = this.queue()[this.currentTrackIndex() - 1];
      this.loadTrack(prevTrack);
    }
  }

  ended(): void {
    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
      this.currentTime.set(0);
      if (this.hasNext()) {
        this.next();
      }
    });
  }

  private resetPlayerState(): void {
    this.isReady.set(false);
    this.isBuffering.set(false);

    this.currentTime.set(0);
    this.duration.set(0);
  }

  public stopAndReset(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
    }

    this.resetPlayerState();

    this.currentTrack.set(null);
  }

  setVolume(value: number): void {
    const boundedVolume = Math.max(0, Math.min(1, value));
    this.volume.set(boundedVolume);
    this.audio.volume = boundedVolume;
  }

  muteToggle(): void {
    const currentVol = this.volume();

    if (currentVol > 0) {
      this.preMuteVolume = currentVol;
      this.setVolume(0);
    } else {
      this.setVolume(this.preMuteVolume || 0.5);
    }
  }
}
