import { Component, computed, input } from '@angular/core';
import { ɵEmptyOutletComponent } from '@angular/router';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'lg' | 'sm' | 'icon-cubic' | 'icon-rounded';

@Component({
  selector: 'app-button',
  imports: [ɵEmptyOutletComponent],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  variant = input<ButtonVariant>('default');
  size = input<ButtonSize>('md');

  protected buttonClasses = computed(() => `btn btn-${this.variant()} ${this.size()}`);
}
