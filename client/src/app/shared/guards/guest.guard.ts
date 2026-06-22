import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../../entities/user/user.state';

export const guestGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isUnsafeAuthenticated()) {
    return true;
  }

  if (router.navigated) {
    return false;
  }

  return router.createUrlTree(['/discover']);
};
