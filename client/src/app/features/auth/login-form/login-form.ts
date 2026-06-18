import { Component, computed, inject, signal } from '@angular/core';
import { email, form, required } from '@angular/forms/signals';
import { Button } from '../../../shared/ui/button/button';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon.component';
import { AuthStore } from '../../../entities/user/user.state';
import { IconName } from '../../../shared/ui/icon/icon-registry';
import { AutofocusDirective } from '../../../shared/directives/autofocus.directive';
import { Input } from '../../../shared/forms/input/input';

export interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [Input, Button, CommonModule, RouterLink, Icon, AutofocusDirective],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export default class LoginForm {
  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  store = inject(AuthStore);
  router = inject(Router);

  loginForm = form(this.loginModel, (schema) => {
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Must be a correct email' });

    required(schema.password, { message: 'Password is required' });
  });

  generalError = signal('');
  generalMessage = computed<{ icon: IconName; message: string }>(() => {
    if (this.generalError()) {
      return { icon: 'warning', message: this.generalError() };
    }

    return { icon: 'info', message: 'Fill in your email and password to access your account!' };
  });

  submitButton = computed<{ icon: IconName; message: string }>(() => {
    if (this.store.loading()) {
      return { icon: 'refresh', message: 'Authenticating...' };
    }

    return { icon: 'logIn', message: 'Submit' };
  });

  async onSubmit() {
    if (!this.loginForm().valid()) {
      this.generalError.set('Something went wrong');
      return;
    }

    const formData = this.loginForm().value();

    await this.store.login(formData);

    if (this.store.error()) {
      this.generalError.set(this.store.error()!.message);
      return;
    }

    this.generalError.set('');

    // this.router.navigateByUrl('/discover');
  }
}
