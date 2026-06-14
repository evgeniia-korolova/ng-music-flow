import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { Dropdown } from '../../shared/ui/dropdown/dropdown';
import { ThemeToggler } from '../../features/theme-toggler/theme-toggler';
import { ThemeStore } from '../../features/theme-toggler/theme.store';
import { Route, Router, RouterLink } from '@angular/router';
import { DropdownCloseDirective } from '../../shared/ui/dropdown/dropdown-close.directive';
import { Icon } from '../../shared/ui/icon/icon.component';
import { NavigationBar } from '../../features/navigation-bar/navigation-bar';
import { Button } from '../../shared/ui/button/button';
import { AuthStore } from '../../entities/user/user.state';
import { SearchToggleService } from '../../features/search/services/search-toggle-service';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';

@Component({
  selector: 'app-header',
  imports: [
    Dropdown,
    ThemeToggler,
    RouterLink,
    DropdownCloseDirective,
    Icon,
    NavigationBar,
    Button,
    AutofocusDirective,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  readonly themeStore = inject(ThemeStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly searchService = inject(SearchToggleService);

  readonly showSearchBar = this.searchService.isSearchBarVisible;
  readonly userMenu = viewChild<Dropdown>('userMenu');

  readonly user = computed(() => this.authStore.user());

  protected navItems: Route[] = [];

  signOut = () => {
    this.authStore.logout();
    this.cdr.detectChanges();
    this.router.navigateByUrl('discover');
  };

  handleAuthButtonClick = (event: Event) => {
    if (!this.user()) {
      event.stopPropagation();
      event.preventDefault();
      this.router.navigateByUrl('/auth/register');
    } else {
      this.userMenu()?.toggleDropdown(event);
    }
  };

  setNavItems() {
    const routes = this.router.config.flatMap((layout) => layout.children || []);

    this.navItems = routes.filter((route) => route?.data?.['displayOnNavbar'] === true);
  }

  ngOnInit(): void {
    this.setNavItems();
  }
}
