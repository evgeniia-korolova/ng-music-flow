import { Directive, HostListener, inject } from '@angular/core';
import { Dropdown } from './dropdown';

@Directive({
  selector: '[appDropdownClose]',
  standalone: true,
})
export class DropdownCloseDirective {
  private readonly parentDropdown = inject(Dropdown);

  @HostListener('click')
  onClick() {
    this.parentDropdown.isOpen.update(() => false);
  }
}
