import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';
import { Button } from '../../../../shared/ui/button/button';
import { Icon } from '../../../../shared/ui/icon/icon.component';

type InputType = 'text' | 'password' | 'number' | 'textbox';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormField, Button, Icon],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input<T extends string | number = string> {
  field = input.required<Field<string, T>>();
  public inputElement = viewChild('inputElement', {
    read: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
  });
  label = input<string>('');
  placeHolder = input<string>('');
  inputType = input<InputType>('text');
  hideUntilTouched = input(true);

  protected inputId = crypto.randomUUID();
  protected showPassword = signal(false);

  protected currentType = computed<InputType>(() => {
    if (this.inputType() === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }

    return this.inputType();
  });

  protected state = computed(() => this.field()());

  protected error = computed<string | null>(() => {
    const currentState = this.state();
    const errors = currentState.errors();
    if (!errors || errors.length === 0) return null;

    return errors[0].message ?? 'Something went wrong';
  });

  protected displayError = computed(
    () =>
      (!this.hideUntilTouched() || this.state().touched()) &&
      this.state().invalid() &&
      this.error(),
  );

  protected togglePassword = () => this.showPassword.update((current) => !current);
}
