import { Component, computed, input } from '@angular/core';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'danger' | 'info';
type ButtonSize = 'md' | 'lg' | 'sm' | 'icon-cubic' | 'icon-rounded';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  variant = input<ButtonVariant>('default');
  size = input<ButtonSize>('md');

  protected buttonClasses = computed(() => `btn btn-${this.variant()} ${this.size()}`);
}
