import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginData } from '../../features/auth/login-form/login-form';
import { RegisterData } from '../../features/auth/register-form/register-form';
import { AuthStore } from '../../entities/user/user.state';
import { AlertMessage } from '../../shared/ui/alert-message/alert-message';
import { Button } from '../../shared/ui/button/button';
import { environment } from '../../../environments/environment';
import { connectToJamendo } from '../../shared/utils/jamendo';

export interface Submittable {
  submit: (data: LoginData | RegisterData) => Promise<void>;
}

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, AlertMessage, Button],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export default class Auth {
  readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  isOpen = computed(
    () => this.authStore.isNotSyncedToJamendo() && !this.router.url.includes('/jamendo'),
  );

  jamendoOAuth2Endpoint = `${environment.appApiUrl}/auth/jamendo/`;

  actOnClose = () => {
    this.router.navigateByUrl('/discover');
  };

  connectJamendo() {
    const currentToken = this.authStore.token();

    connectToJamendo(currentToken);
  }
}
