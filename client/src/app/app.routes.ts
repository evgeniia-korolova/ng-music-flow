import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/discover/discover'),
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
          },
          {
            path: 'new',
            loadComponent: () => import('./widgets/tracks-list/tracks-list'),
            data: { order: 'releasedate_desc' },
          },
          {
            path: 'genres',
            loadComponent: () => import('./widgets/genres/genres'),
          },
        ],
      },
      { path: 'artists', loadComponent: () => import('./pages/artists/artists') },
    ],
  },
];
