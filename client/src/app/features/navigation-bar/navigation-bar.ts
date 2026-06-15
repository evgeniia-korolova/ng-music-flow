import { Component, input } from '@angular/core';
import { Route, RouterLink, RouterLinkActive } from '@angular/router';
import { Dropdown } from '../../shared/ui/dropdown/dropdown';
import { Icon } from '../../shared/ui/icon/icon.component';
import { Button } from '../../shared/ui/button/button';
import { DropdownCloseDirective } from '../../shared/ui/dropdown/dropdown-close.directive';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';

@Component({
  selector: 'app-navigation-bar',
  imports: [
    Dropdown,
    DropdownCloseDirective,
    Icon,
    RouterLink,
    RouterLinkActive,
    Button,
    AutofocusDirective,
  ],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.scss',
})
export class NavigationBar {
  pathCollection = input.required<Route[]>();
}
