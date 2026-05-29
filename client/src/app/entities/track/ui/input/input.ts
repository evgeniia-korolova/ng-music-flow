import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { Field, FieldState, FormField } from '@angular/forms/signals';

type InputType = 'text' | 'password' | 'number' | 'textbox';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormField],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input<T extends string | number = string> {
  field = input.required<Field<string, T>>();
  label = input<string>('');
  placeHolder = input<string>('');
  inputType = input<InputType>('text');

  protected inputId = crypto.randomUUID();

  showPassword = signal(false);

  currentType = computed<InputType>(() => {
    if (this.inputType() === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }

    return this.inputType();
  });

  protected get state(): FieldState<string, T> {
    return this.field()();
  }

  error = computed<string | null>(() => {
    const errors = this.state.errors();
    if (!errors || errors.length === 0) return null;

    return errors[0].message ?? 'Something went wrong';
  });
}
