import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

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
            data: { order: 'popularity_total', pageTitle: 'Popular Tracks' },
            title: 'Popular Tracks',
          },
          {
            path: 'new',
            loadComponent: () => import('./widgets/discover-tabs-switcher/discover-tabs-switcher'),
            data: { order: 'releasedate_desc', pageTitle: 'New Releases' },
            title: 'New Releases',
          },
          {
            path: 'genres',
            loadComponent: () => import('./widgets/genres/genres'),
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
        loadComponent: () => import('./pages/artist-profile/artist-profile'),
        title: 'ArtistProfile',
      },
    ],
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'auth',
        loadComponent: () => import('./pages/auth/auth'),
        children: [
          {
            path: 'login',
            title: 'Sign In',
            loadComponent: () => import('./features/auth/login-form/login-form'),
          },
          {
            path: 'register',
            title: 'Sign Up',
            loadComponent: () => import('./features/auth/register-form/register-form'),
          },
        ],
      },
    ],
  },
];
