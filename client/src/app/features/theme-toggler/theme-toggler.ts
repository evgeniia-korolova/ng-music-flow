import { Component, input, output } from '@angular/core';
import { Dropdown } from '../../shared/ui/dropdown/dropdown';
import { ThemeMode } from './theme.store';
import { LucideDynamicIcon } from '@lucide/angular';
import { DropdownCloseDirective } from '../../shared/ui/dropdown/dropdown-close.directive';
import { themeStates } from '../../shared/constants/theme-states';

@Component({
  selector: 'app-theme-toggler',
  imports: [Dropdown, LucideDynamicIcon, DropdownCloseDirective],
  templateUrl: './theme-toggler.html',
  styleUrl: './theme-toggler.scss',
})
export class ThemeToggler {
  currentTheme = input.required<ThemeMode>();
  themeChanged = output<ThemeMode>();

  themes: ThemeMode[] = Object.keys(themeStates) as ThemeMode[];

  changeTheme(mode: ThemeMode) {
    console.log('changing theme', mode);
    this.themeChanged.emit(mode);
  }

  getIcon = (theme: ThemeMode) => themeStates[theme];
}
