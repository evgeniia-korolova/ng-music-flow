import { Component, computed, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../entities/user/user.state';
import { connectToJamendo } from '../../../shared/utils/jamendo';
import { Button } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-jamendo',
  imports: [Button],
  templateUrl: './jamendo.html',
  styleUrl: './jamendo.scss',
})
export default class Jamendo implements OnDestroy {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  readonly status = input<string | null>(null);

  readonly countdown = signal<number>(5);
  private timerId: number | null = null;

  constructor() {
    effect(() => {
      if (this.status()?.toUpperCase() === 'SUCCESS') {
        this.authStore.retrieveUserInformation();
        this.startCountdown();
      }
    });
  }

  readonly message = computed<{
    title: string;
    body: string;
    button: string;
    actOnClick: () => void;
  }>(() => {
    if (this.status()?.toUpperCase() === 'SUCCESS') {
      return {
        title: 'Success!',
        body: `You have successfully synced to Jamendo account. Redirecting to Discovery in ${this.countdown()}s...`,
        button: 'Navigate to Discovery',
        actOnClick: () => this.router.navigateByUrl('/Discovery'),
      };
    }

    if (this.status()) {
      let errorMessage = 'Internal Server Error. Please try authorizing again!';

      switch (this.status()?.toUpperCase()) {
        case 'AUTH.JAMENDO.FAILED': {
          errorMessage = 'Jamendo Authorization failed for some unknown reason.';
          break;
        }
        case 'AUTH.JAMENDO.CONFLICT': {
          errorMessage = 'Jamendo account is already synced with another user.';
          break;
        }
        case 'AUTH.DATABASE.ERROR': {
          errorMessage = 'Jamendo Authorization failed for some unknown reason.';
          break;
        }
      }

      return {
        title: 'Opss! Something went wrong',
        body: errorMessage,
        button: 'Retry',
        actOnClick: () => this.connectJamendo(),
      };
    }

    return {
      title: 'Jamendo Authorization',
      body: 'To gain full access to our App, please connect your Jamendo account!',
      button: 'Connect Jamendo',
      actOnClick: () => this.connectJamendo(),
    };
  });

  private startCountdown(): void {
    this.clearTimer();

    this.timerId = setInterval(() => {
      this.countdown.update((current) => current - 1);

      if (this.countdown() <= 0) {
        this.navigateToDiscovery();
      }
    }, 1000);
  }

  private navigateToDiscovery(): void {
    this.clearTimer();
    this.router.navigateByUrl('/discover');
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  connectJamendo = () => {
    const token = this.authStore.token();

    connectToJamendo(token);
  };

  ngOnDestroy(): void {
    this.clearTimer();
  }
}
