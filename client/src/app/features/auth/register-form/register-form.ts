import { Component, computed, inject, signal } from '@angular/core';
import {
  email,
  form,
  maxLength,
  minLength,
  pattern,
  required,
  validate,
} from '@angular/forms/signals';
import { Button } from '../../../shared/ui/button/button';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../entities/user/user.state';
import { IconName } from '../../../shared/ui/icon/icon-registry';
import { AutofocusDirective } from '../../../shared/directives/autofocus.directive';
import { Icon } from '../../../shared/ui/icon/icon.component';
import { Input } from '../../../shared/forms/input/input';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register-form',
  imports: [Input, Button, RouterLink, AutofocusDirective, Icon],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export default class RegisterForm {
  registerModel = signal<RegisterData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  store = inject(AuthStore);
  router = inject(Router);

  registeredUsernames = signal<string[]>([]);
  registeredEmails = signal<string[]>([]);

  registerForm = form(this.registerModel, (schema) => {
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Must be a correct email' });
    validate(schema.email, ({ value }) => {
      const result = this.registeredEmails().includes(value());

      if (result) {
        return { kind: 'email-in-use', message: 'This email is already used by other user' };
      }

      return null;
    });

    required(schema.username, { message: 'Username is required' });
    minLength(schema.username, 3, { message: 'Must be at least 3 letters' });
    maxLength(schema.username, 15, { message: 'Must be at most 3 letters' });
    validate(schema.username, ({ value }) => {
      const result = this.registeredUsernames().includes(value());

      if (result) {
        return { kind: 'username-in-use', message: 'This username is already used by other user' };
      }

      return null;
    });
    pattern(schema.username, /^[\w-]+$/, {
      message: 'Can only include letters, numbers, underscore and hyphen',
    });

    required(schema.password, { message: 'Password is required' });
    minLength(schema.password, 8, { message: 'Must be at least 8 letters' });
    maxLength(schema.password, 24, { message: 'Must be at most 24 letters' });
    pattern(schema.password, /.*[A-Z].*/, { message: 'Must include uppercase letter' });
    pattern(schema.password, /.*[a-z].*/, { message: 'Must include lowercase letter' });
    pattern(schema.password, /.*\d.*/, { message: 'Must include number' });
    pattern(schema.password, /.*[@$!%*?&].*/, { message: 'Must include special character' });
    pattern(schema.password, /^\S+$/, { message: 'Must not include spaces' });

    required(schema.confirmPassword, { message: 'Retype your password' });
    validate(schema.confirmPassword, (context) => {
      const password = context.valueOf(schema.password);

      if (password !== context.value()) {
        return { kind: 'password-mismatch', message: 'Passwords do not match' };
      }

      return null;
    });
  });

  generalError = signal('');
  generalMessage = computed<{ icon: IconName; message: string }>(() => {
    if (this.generalError()) {
      return { icon: 'warning', message: this.generalError() };
    }

    return {
      icon: 'info',
      message: 'Fill in the fields below to create your new personal account!',
    };
  });

  submitButton = computed<{ icon: IconName; message: string }>(() => {
    if (this.store.loading()) {
      return { icon: 'refresh', message: 'Authenticating...' };
    }

    return { icon: 'logIn', message: 'Submit' };
  });

  async onSubmit() {
    if (!this.registerForm().valid()) {
      this.generalError.set('Something went wrong');
      return;
    }

    const formData = this.registerForm().value();

    await this.store.register(formData);

    const error = this.store.error();

    if (error) {
      const code = error.code;
      if (code) {
        switch (code) {
          case 'AUTH.USERNAME.TAKEN': {
            this.registeredUsernames.update((val) => [...val, formData.username]);
            break;
          }
          case 'AUTH.EMAIL.TAKEN': {
            this.registeredEmails.update((val) => [...val, formData.email]);
          }
        }

        this.generalError.set('');
      }

      this.generalError.set(this.store.error()!.message);
      return;
    }

    this.generalError.set('');

    this.router.navigateByUrl('/discover');
  }
}
