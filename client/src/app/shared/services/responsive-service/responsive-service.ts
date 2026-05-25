import { computed, inject, Injectable } from '@angular/core';
import { largeScreenWidth, mediumScreenWidth, smallScreenWidth } from '../../constants/breakpoints';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly state = toSignal(
    this.breakpointObserver.observe([smallScreenWidth, mediumScreenWidth, largeScreenWidth]),
  );

  readonly isSmall = computed(() => !!this.state()?.breakpoints[smallScreenWidth]);
  readonly isMedium = computed(() => !!this.state()?.breakpoints[mediumScreenWidth]);
  readonly isLarge = computed(() => !!this.state()?.breakpoints[largeScreenWidth]);
}
