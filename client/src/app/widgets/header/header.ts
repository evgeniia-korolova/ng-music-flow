import { Component, inject } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dropdown } from '../../shared/ui/dropdown/dropdown';
import { ThemeToggler } from '../../features/theme-toggler/theme-toggler';
import { ThemeStore } from '../../features/theme-toggler/theme.store';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DropdownCloseDirective } from '../../shared/ui/dropdown/dropdown-close.directive';

@Component({
  selector: 'app-header',
  imports: [
    LucideDynamicIcon,
    Dropdown,
    ThemeToggler,
    RouterLink,
    DropdownCloseDirective,
    RouterLinkActive,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  themeStore = inject(ThemeStore);
  private readonly router = inject(Router);

  get navItems() {
    const routes = this.router.config.flatMap((layout) => layout.children || []);

    return routes.filter((route) => route?.data?.['displayOnNavbar'] === true);
  }
}
