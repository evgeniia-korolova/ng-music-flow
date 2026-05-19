import { Directive, inject } from '@angular/core';
import { Dropdown } from './dropdown';

@Directive({
  selector: '[appDropdownClose]',
  standalone: true,
  host: {
    '(click)': 'closeDropdown()',
  },
})
export class DropdownCloseDirective {
  private readonly parentDropdown = inject(Dropdown);

  closeDropdown() {
    this.parentDropdown.isOpen.set(false);
  }
}
