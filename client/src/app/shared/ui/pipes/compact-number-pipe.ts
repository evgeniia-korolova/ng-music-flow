import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compactNumberPipe',
})
export class CompactNumberPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return '0';

    const absValue = Math.abs(value);

    if (absValue >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }

    if (absValue >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }

    return value.toString();
  }
}
