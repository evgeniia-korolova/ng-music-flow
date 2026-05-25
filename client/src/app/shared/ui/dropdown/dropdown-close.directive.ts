import { Directive, input } from '@angular/core';
import { Dropdown } from './dropdown';

@Directive({
  selector: '[appDropdownClose]',
  standalone: true,
  host: {
    '(click)': 'closeDropdown()',
  },
})
export class DropdownCloseDirective {
  parentDropdown = input.required<Dropdown>({ alias: 'appDropdownClose' });

  closeDropdown() {
    this.parentDropdown().isOpen.set(false);
  }
}
