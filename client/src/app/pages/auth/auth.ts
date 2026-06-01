import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { LoginData } from '../../features/auth/login-form/login-form';
import { RegisterData } from '../../features/auth/register-form/register-form';

export interface Submittable {
  submit: (data: LoginData | RegisterData) => Promise<void>;
}

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export default class Auth {
  route = inject(ActivatedRoute);

  mode = computed(() => {
    const childSnapshot = this.route.snapshot.firstChild;
    return childSnapshot?.data['mode'] ?? 'login';
  });
}
