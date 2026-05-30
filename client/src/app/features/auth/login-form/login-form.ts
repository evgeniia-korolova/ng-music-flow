import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Input } from '../../../entities/track/ui/input/input';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [Input],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export default class LoginForm {
  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel);
}
