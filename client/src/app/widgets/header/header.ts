import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Dropdown } from '../../shared/ui/dropdown/dropdown';
import { ThemeToggler } from '../../features/theme-toggler/theme-toggler';
import { ThemeStore } from '../../features/theme-toggler/theme.store';
import { Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DropdownCloseDirective } from '../../shared/ui/dropdown/dropdown-close.directive';
import { ICON_REGISTRY } from '../../shared/ui/icon/icon-registry';
import { Icon } from '../../shared/ui/icon/icon.component';
import { NavigationBar } from '../../features/navigation-bar/navigation-bar';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-header',
  imports: [
    Dropdown,
    ThemeToggler,
    RouterLink,
    DropdownCloseDirective,
    RouterLinkActive,
    Icon,
    NavigationBar,
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

  icons = Object.keys(ICON_REGISTRY);

  setNavItems() {
    const routes = this.router.config.flatMap((layout) => layout.children || []);

    this.navItems = routes.filter((route) => route?.data?.['displayOnNavbar'] === true);
  }

  ngOnInit(): void {
    this.setNavItems();
  }
}
