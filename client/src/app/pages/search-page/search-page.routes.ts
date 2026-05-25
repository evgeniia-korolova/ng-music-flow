import { Routes } from '@angular/router';

export const SEARCH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./ui/search-page'),
    data: { pageTitle: 'Search Tracks', order: 'popularity_total' },
  },
];
