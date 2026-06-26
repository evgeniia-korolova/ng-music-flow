import { Routes } from '@angular/router';

export const LIBRARY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./library').then((m) => m.default),
    children: [
      {
        path: '',
        redirectTo: 'history',
        pathMatch: 'full',
      },
      {
        path: 'history',
        loadComponent: () =>
          import('../../features/tracks-history/ui/history-content/history-content').then(
            (m) => m.HistoryContent,
          ),
      },
      {
        path: 'custom-tracks',

        loadComponent: () =>
          import('../../widgets/custom-tracks/custom-tracks').then((m) => m.CustomTracks),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('../../features/playlist/create-playlist-form/create-playlist-form').then(
            (m) => m.CreatePlaylistForm,
          ),
      },
      {
        path: 'playlists/:name',
        loadComponent: () =>
          import('../../widgets/drag-drop-list/drag-drop-list').then((m) => m.DragDropList),
      },
    ],
  },
];
