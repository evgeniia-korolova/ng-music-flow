import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-track-waveform',
  imports: [],
  templateUrl: './track-waveform.html',
  styleUrl: './track-waveform.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackWaveform implements OnDestroy {
  readonly peaks = input.required<number[]>();
  readonly progress = input(0);

  readonly isActive = input(false);
  protected readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private contextSignal = signal<CanvasRenderingContext2D | null>(null);

  constructor() {
    effect(() => {
      const canvasEl = this.canvasRef()?.nativeElement;
      if (!canvasEl) return;

      if (!this.contextSignal()) {
        const rect = canvasEl.getBoundingClientRect();
        const parentWidth = canvasEl.parentElement?.getBoundingClientRect().width;

        canvasEl.width =
          parentWidth && parentWidth > 0 ? parentWidth : rect.width > 0 ? rect.width : 300;
        canvasEl.height = 32;

        const ctx = canvasEl.getContext('2d');
        if (ctx) {
          this.contextSignal.set(ctx);
        }
      }

      const ctx = this.contextSignal();
      if (!ctx) return;

      const peaksData = this.peaks();
      const currentProgress = this.progress();

      this.drawWaveform(canvasEl, ctx, peaksData, currentProgress);
    });
  }

  private drawWaveform(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    peaks: number[],
    progress: number,
  ): void {
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const barWidth = 2;
    const minGap = 1;

    const currentProgressX = (progress / 100) * width;

    const totalBarsWidth = peaks.length * barWidth;
    const remainingWidth = width - totalBarsWidth;
    const gap =
      peaks.length > 1 && remainingWidth > 0
        ? Math.max(minGap, remainingWidth / (peaks.length - 1))
        : minGap;

    peaks.forEach((peak, index) => {
      const x = index * (barWidth + gap);
      const barHeight = peak * height;
      const y = (height - barHeight) / 2;

      ctx.fillStyle = x <= currentProgressX ? '#ec4899' : '#4a4a4a';
      ctx.fillRect(x, y, barWidth, barHeight);
    });
  }

  ngOnDestroy(): void {
    this.contextSignal.set(null);
  }
}
