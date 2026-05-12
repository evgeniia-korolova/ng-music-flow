import { Routes } from '@angular/router';
import { MainLayout } from './shared/ui/layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home'),
      },
    ],
  },
];
