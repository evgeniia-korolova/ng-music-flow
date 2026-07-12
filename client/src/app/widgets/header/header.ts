import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { Dropdown } from '../../shared/ui/dropdown/dropdown';
import { ThemeToggler } from '../../features/theme-toggler/theme-toggler';
import { ThemeStore } from '../../features/theme-toggler/theme.store';
import { Router, RouterLink } from '@angular/router';
import { DropdownCloseDirective } from '../../shared/ui/dropdown/dropdown-close.directive';
import { Icon } from '../../shared/ui/icon/icon.component';
import { NavigationBar } from '../../features/navigation-bar/navigation-bar';
import { Button } from '../../shared/ui/button/button';
import { AuthStore } from '../../entities/user/user.state';
import { SearchToggleService } from '../../features/search/services/search-toggle-service';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';

@Component({
  selector: 'app-header',
  standalone: true,
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
export class Header {
  readonly themeStore = inject(ThemeStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly searchService = inject(SearchToggleService);

  readonly showSearchBar = this.searchService.isSearchBarVisible;
  readonly userMenu = viewChild<Dropdown>('userMenu');

  readonly user = computed(() => this.authStore.user());
  readonly isSafeAuthenticated = this.authStore.isSafeAuthenticated;
  readonly isNotSynced = this.authStore.isNotSyncedToJamendo;

  protected readonly navItems = computed(() => {
    const routes = this.router.config.flatMap((layout) => layout.children || []);

    return routes.filter(
      (route) =>
        route?.data?.['displayOnNavbar'] === true &&
        (this.authStore.isUnsafeAuthenticated() || !route?.data?.['requiresAuth']),
    );
  });

  signOut = () => {
    this.authStore.logout();
    this.cdr.detectChanges();
    this.router.navigateByUrl('discover');
  };

  handleAuthButtonClick = (event: Event) => {
    if (this.authStore.isUnsafeAuthenticated()) {
      this.userMenu()?.toggleDropdown(event);
    } else {
      event.stopPropagation();
      event.preventDefault();
      this.router.navigateByUrl('/auth/register');
    }
  };
}
