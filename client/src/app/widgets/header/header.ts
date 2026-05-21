import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dropdown } from '../../shared/ui/dropdown/dropdown';
import { ThemeToggler } from '../../features/theme-toggler/theme-toggler';
import { ThemeStore } from '../../features/theme-toggler/theme.store';
import { Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DropdownCloseDirective } from '../../shared/ui/dropdown/dropdown-close.directive';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-header',
  imports: [
    LucideDynamicIcon,
    Dropdown,
    ThemeToggler,
    RouterLink,
    DropdownCloseDirective,
    RouterLinkActive,
    Button,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  themeStore = inject(ThemeStore);
  private readonly router = inject(Router);

  protected navItems: Route[] = [];

  setNavItems() {
    const routes = this.router.config.flatMap((layout) => layout.children || []);

    this.navItems = routes.filter((route) => route?.data?.['displayOnNavbar'] === true);
  }

  ngOnInit(): void {
    this.setNavItems();
  }
}
