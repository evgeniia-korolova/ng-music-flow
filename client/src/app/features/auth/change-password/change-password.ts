import { Component, computed, inject, signal } from '@angular/core';
import { AuthStore } from '../../../entities/user/user.state';
import { Router } from '@angular/router';
import { form, required, minLength, maxLength, pattern, validate } from '@angular/forms/signals';
import { IconName } from '../../../shared/ui/icon/icon-registry';
import { Icon } from '../../../shared/ui/icon/icon.component';
import { Input } from '../../../shared/forms/input/input';
import { Button } from '../../../shared/ui/button/button';

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-change-password',
  imports: [Icon, Input, Button],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export default class ChangePassword {
  changePasswordModel = signal<ChangePasswordData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  readonly store = inject(AuthStore);
  readonly router = inject(Router);

  readonly wrongPassword = signal<string>('');

  changePasswordForm = form(this.changePasswordModel, (schema) => {
    required(schema.oldPassword, { message: 'Old password is required' });
    validate(schema.oldPassword, (context) => {
      const password = context.valueOf(schema.oldPassword);

      if (password === this.wrongPassword()) {
        return { kind: 'wrong-password', message: 'Wrong password provided' };
      }

      return null;
    });

    required(schema.newPassword, { message: 'Password is required' });
    minLength(schema.newPassword, 8, { message: 'Must be at least 8 letters' });
    maxLength(schema.newPassword, 24, { message: 'Must be at most 24 letters' });
    pattern(schema.newPassword, /.*[A-Z].*/, { message: 'Must include uppercase letter' });
    pattern(schema.newPassword, /.*[a-z].*/, { message: 'Must include lowercase letter' });
    pattern(schema.newPassword, /.*\d.*/, { message: 'Must include number' });
    pattern(schema.newPassword, /.*[@$!%*?&].*/, { message: 'Must include special character' });
    pattern(schema.newPassword, /^\S+$/, { message: 'Must not include spaces' });

    required(schema.confirmPassword, { message: 'Retype your password' });
    validate(schema.confirmPassword, (context) => {
      const password = context.valueOf(schema.newPassword);

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
      message: 'Fill in the fields below to change password to your account!',
    };
  });

  submitButton = computed<{ icon: IconName; message: string }>(() => {
    if (this.store.loading()) {
      return { icon: 'refresh', message: 'Changing passwords...' };
    }

    return { icon: 'lock', message: 'Submit' };
  });

  async onSubmit() {
    if (!this.changePasswordForm().valid()) {
      this.generalError.set('Something went wrong');
      return;
    }

    const formData = this.changePasswordForm().value();

    await this.store.changePassword(formData);

    const error = this.store.error();

    if (error) {
      const code = error.code;
      if (code && code === 'AUTH.CHANGE_PASSWORD.MISMATCH') {
        this.wrongPassword.set(formData.oldPassword);

        this.generalError.set('');
      } else {
        this.generalError.set(this.store.error()!.message);
      }

      return;
    }

    this.wrongPassword.set('');
    this.generalError.set('');

    this.changePasswordModel.set({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    this.changePasswordForm().reset();
  }
}
