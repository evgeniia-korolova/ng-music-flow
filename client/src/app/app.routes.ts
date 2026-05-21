import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';

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
            loadComponent: () => import('./widgets/tracks-list/tracks-list'),
            data: { order: 'popularity_month' },
            title: 'Popular tracks',
          },
          {
            path: 'new',
            loadComponent: () => import('./widgets/tracks-list/tracks-list'),
            data: { order: 'releasedate_desc' },
            title: 'New releases',
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
        path: '',
        redirectTo: 'discover',
        pathMatch: 'full',
      },
    ],
  },
];
