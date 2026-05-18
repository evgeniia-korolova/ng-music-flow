import { Component, inject } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dropdown } from '../../shared/ui/dropdown/dropdown';
import { ThemeToggler } from '../../features/theme-toggler/theme-toggler';
import { ThemeStore } from '../../features/theme-toggler/theme.store';

@Component({
  selector: 'app-header',
  imports: [LucideDynamicIcon, Dropdown, ThemeToggler],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  themeStore = inject(ThemeStore);
}
