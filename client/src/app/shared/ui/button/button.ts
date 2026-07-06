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
  | 'icon-rounded-lg'
  | 'avatar';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('default');
  readonly size = input<ButtonSize>('md');
  readonly active = input(false);
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  protected buttonClasses = computed(
    () => `btn ${this.active() ? 'active' : ''} btn-${this.variant()} ${this.size()}`,
  );
}
