import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './shared/guards/auth.guard';
import { guestGuard } from './shared/guards/guest.guard';
import { jamendoGuard } from './shared/guards/jamendo-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'discover',

        loadComponent: () => import('./pages/discover/discover'),
        title: 'Discover',
        data: { displayOnNavbar: true },
        children: [
          {
            path: '',
            redirectTo: 'popular',
            pathMatch: 'full',
          },
          {
            path: 'popular',
            loadComponent: () => import('./widgets/discover-tabs-switcher/discover-tabs-switcher'),
            //component: DiscoverTabsSwitcher,
            data: { order: 'popularity_total', pageTitle: 'Popular Tracks', skipBreadcrumb: true },
            title: 'Popular Tracks',
          },
          {
            path: 'new',
            loadComponent: () => import('./widgets/discover-tabs-switcher/discover-tabs-switcher'),
            data: { order: 'releasedate_desc', pageTitle: 'New Releases', skipBreadcrumb: true },
            title: 'New Releases',
          },
          {
            path: 'genres',
            loadComponent: () => import('./widgets/genres/genres').then((m) => m.Genres),
            data: { skipBreadcrumb: true, preload: true },
            title: 'Genres',
          },
        ],
      },
      {
        path: 'artists',
        loadComponent: () => import('./pages/artists/artists'),
        title: 'Artists',
        data: { displayOnNavbar: true },
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./pages/search-page/search-page.routes').then((m) => m.SEARCH_ROUTES),
      },
      {
        path: '',
        redirectTo: 'discover',
        pathMatch: 'full',
      },
      {
        path: 'artists/:artistId',
        loadComponent: () =>
          import('./pages/artist-profile/artist-profile').then((m) => m.ArtistProfile),
        title: 'Artist Profile',
        data: { breadcrumb: 'Artist Profile', parentLabel: 'Artists', parentUrl: '/artists' },
      },
      {
        path: 'albums/:albumId',
        loadComponent: () =>
          import('./pages/album-profile/album-profile').then((m) => m.AlbumProfile),
        title: 'Album',
        data: { breadcrumb: 'Album', parentLabel: 'Artists', parentUrl: '/artists' },
      },
      {
        path: 'auth',
        loadComponent: () => import('./pages/auth/auth'),
        children: [
          {
            path: 'login',
            title: 'Sign In',
            loadComponent: () => import('./features/auth/login-form/login-form'),
            canActivate: [guestGuard],
          },
          {
            path: 'register',
            title: 'Sign Up',
            loadComponent: () => import('./features/auth/register-form/register-form'),
            canActivate: [guestGuard],
          },
          {
            path: 'jamendo',
            title: 'Sync to Jamendo',
            loadComponent: () => import('./features/auth/jamendo/jamendo'),
            canActivate: [jamendoGuard],
          },
          {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/ui/about'),
        title: 'About',
        data: { displayOnNavbar: true },
      },
      {
        path: 'library',
        //loadComponent: () => import('./pages/library/library'),
        title: 'Library',
        data: { displayOnNavbar: true, requiresAuth: true },
        loadChildren: () => import('./pages/library/library.routes').then((m) => m.LIBRARY_ROUTES),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
