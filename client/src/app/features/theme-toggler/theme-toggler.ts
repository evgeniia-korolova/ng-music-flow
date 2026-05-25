import { Component, input, output } from '@angular/core';
import { Dropdown } from '../../shared/ui/dropdown/dropdown';
import { ThemeMode } from './theme.store';
import { DropdownCloseDirective } from '../../shared/ui/dropdown/dropdown-close.directive';
import { themeStates } from '../../shared/constants/theme-states';
import { Icon } from '../../shared/ui/icon/icon.component';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-theme-toggler',
  imports: [Dropdown, DropdownCloseDirective, Icon, Button],
  templateUrl: './theme-toggler.html',
  styleUrl: './theme-toggler.scss',
})
export class ThemeToggler {
  currentTheme = input.required<ThemeMode>();
  themeChanged = output<ThemeMode>();

  themes: ThemeMode[] = Object.keys(themeStates) as ThemeMode[];

  changeTheme(mode: ThemeMode) {
    this.themeChanged.emit(mode);
  }

  getIcon = (theme: ThemeMode) => themeStates[theme];
}
