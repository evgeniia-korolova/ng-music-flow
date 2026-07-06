import { inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FormNavigationService {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  goBackOrFallback(fallbackUrl = '/'): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      void this.router.navigate([fallbackUrl]);
    }
  }
}
