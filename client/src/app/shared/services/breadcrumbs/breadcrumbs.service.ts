import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  private router = inject(Router);
  public readonly breadcrumbs = signal<Breadcrumb[]>([]);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const root = this.router.routerState.snapshot.root;

      this.breadcrumbs.set(this.buildBreadcrumbs(root));
    });
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url = '',
    breadcrumbs: Breadcrumb[] = [],
  ): Breadcrumb[] {
    const path = route.url.map((el) => el.path).join('/');
    const nextUrl = path ? `${url}/${path}` : url;
    const label = route.data['breadcrumb'] || route.title;

    if (label) {
      const isDuplicate = breadcrumbs.some((el) => el.label === label);
      if (!isDuplicate) {
        const parentUrl = route.data['parentUrl'];
        const parentLabel = route.data['parentLabel'];
        if (parentUrl) {
          breadcrumbs.push({ label: parentLabel, url: parentUrl });
        }
        if (!route.data['skipBreadcrumb']) {
          breadcrumbs.push({ label, url: nextUrl });
        }
      }
    }
    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, nextUrl, breadcrumbs);
    }
    return breadcrumbs;
  }
}
