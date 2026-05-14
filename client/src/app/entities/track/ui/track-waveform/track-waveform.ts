import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-track-waveform',
  imports: [],
  templateUrl: './track-waveform.html',
  styleUrl: './track-waveform.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackWaveform {
  readonly peaks = input.required<number[]>();
  readonly progress = input(0);

  readonly isActive = input(false);
  protected readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private context?: CanvasRenderingContext2D;

  private readonly barWidth = 3;
  private readonly gap = 2;
  private readonly minGap = 1;

  constructor() {
    afterNextRender(() => {
      this.initializeCanvas();
      this.drawWaveform();
    });

    effect(() => {
      this.peaks();
      this.progress();
      this.isActive();

      if (!this.context) {
        return;
      }

      this.drawWaveform();
    });
  }

  private initializeCanvas(): void {
    const canvas = this.canvasRef().nativeElement;

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    this.context = canvas.getContext('2d') ?? undefined;
  }

  private drawWaveform(): void {
    if (!this.context) {
      return;
    }

    const canvas = this.canvasRef().nativeElement;
    const ctx = this.context;
    const peaks = this.peaks();
    const progress = this.progress();
    const width = canvas.width;
    const height = canvas.height;

    const totalBarsWidth = peaks.length * this.barWidth;

    const activeBarsCount = Math.floor((progress / 100) * this.peaks.length);
    const remainingWidth = width - totalBarsWidth;
    const gap = peaks.length > 1 ? Math.max(this.minGap, remainingWidth / (peaks.length - 1)) : 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    peaks?.forEach((peak, index) => {
      const x = index * (this.barWidth + gap);

      const maxBarHeight = height * 0.9;
      const barHeight = peak * maxBarHeight;

      const y = (height - barHeight) / 2;

      const isPlayed = index <= activeBarsCount;

      ctx.fillStyle = this.getBarColor(isPlayed);

      ctx.beginPath();

      ctx.roundRect(x, y, this.barWidth, barHeight, 999);

      ctx.fill();
    });
  }

  private getBarColor(isPlayed: boolean): string {
    if (isPlayed) {
      return this.isActive() ? '#ec4899' : '#9ca3af';
    }

    return '#3f3f46';
  }
}
