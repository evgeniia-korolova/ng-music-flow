import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LoginData } from '../../features/auth/login-form/login-form';
import { RegisterData } from '../../features/auth/register-form/register-form';
import { AuthStore } from '../../entities/user/user.state';
import { AlertMessage } from '../../shared/ui/alert-message/alert-message';

export interface Submittable {
  submit: (data: LoginData | RegisterData) => Promise<void>;
}

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, AlertMessage],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export default class Auth {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authStore = inject(AuthStore);

  isOpen = signal(true);
  displayJamendoAlert = signal(false);

  actOnSuccess = () => {
    if (this.authStore.user()?.jamendoId) {
      this.actOnClose();
    } else {
      this.displayJamendoAlert.set(true);
    }
  };

  actOnClose = () => {
    this.router.navigateByUrl('/discover');
  };

  mode = computed(() => {
    const childSnapshot = this.route.snapshot.firstChild;
    return childSnapshot?.data['mode'] ?? 'login';
  });
}
