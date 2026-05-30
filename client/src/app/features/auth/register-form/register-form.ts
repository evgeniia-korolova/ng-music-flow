import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Input } from '../../../entities/track/ui/input/input';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register-form',
  imports: [Input],
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

  registerForm = form(this.registerModel);
}
