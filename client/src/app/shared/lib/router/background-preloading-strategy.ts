import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { delay, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackgroundPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const shouldPreload = route.data?.['preload'] as boolean | undefined;

    if (shouldPreload) {
      return of(null).pipe(
        delay(2000),
        switchMap(() => load()),
      );
    }

    return of(null);
  }
}
