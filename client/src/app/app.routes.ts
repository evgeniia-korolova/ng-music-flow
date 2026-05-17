import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home'),
      },
      { path: 'artists', loadComponent: () => import('./pages/artists/artists') },
    ],
  },
];
