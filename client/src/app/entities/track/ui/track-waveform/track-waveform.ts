import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-track-waveform',
  imports: [],
  templateUrl: './track-waveform.html',
  styleUrl: './track-waveform.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackWaveform implements OnDestroy {
  // private playerService = inject(AudioPlayerService);
  readonly audioUrl = input<string>();
  readonly isActive = input<boolean>(false);

  // timeChanged = output<number>();

  protected container = viewChild<ElementRef>('waveformContainer');

  private wavesurfer?: WaveSurfer;

  constructor() {
    // Эффект автоматически сработает ТОЛЬКО тогда, когда container() перестанет быть undefined
    effect(() => {
      const element = this.container()?.nativeElement;
      const active = this.isActive();

      // Если элемент появился в DOM, трек активен и волна еще не создана — рисуем!
      if (element && active && !this.wavesurfer) {
        this.initWaveform(element);
      }
    });
  }

  private initWaveform(element: HTMLElement) {
    // Генерируем массив случайных чисел для мгновенной прорисовки палочек
    const fakePeaks = Array.from({ length: 60 }, () => Math.random() * 0.8 + 0.1);

    this.wavesurfer = WaveSurfer.create({
      container: element,
      waveColor: '#4a4a4a',
      progressColor: '#ec4899',
      height: 32,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      url: this.audioUrl(),
      backend: 'MediaElement',
      peaks: [fakePeaks], // Принудительные пики, чтобы wavesurfer не ждал скачивания потока
    });
  }

  ngOnDestroy(): void {
    this.wavesurfer?.destroy();
  }
}
