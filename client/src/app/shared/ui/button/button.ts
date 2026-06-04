import { Component, computed, input } from '@angular/core';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'danger';
type ButtonSize =
  | 'md'
  | 'lg'
  | 'sm'
  | 'icon-cubic-sm'
  | 'icon-rounded-sm'
  | 'icon-cubic-md'
  | 'icon-rounded-md'
  | 'icon-cubic-lg'
  | 'icon-rounded-lg';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  variant = input<ButtonVariant>('default');
  size = input<ButtonSize>('md');
  readonly disabled = input(false);

  protected buttonClasses = computed(() => `btn btn-${this.variant()} ${this.size()}`);
}
