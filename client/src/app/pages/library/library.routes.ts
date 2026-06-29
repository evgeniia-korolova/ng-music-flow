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
          import('../../features/upload-track-form/upload-track-form').then(
            (m) => m.UploadTrackForm,
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('../../features/playlist/create-playlist-form/create-playlist-form').then(
            (m) => m.CreatePlaylistForm,
          ),
      },
      {
        path: 'playlists/:playlistId',
        loadComponent: () =>
          import('../../pages/library/ui/playlist-view-page/playlist-view-page').then(
            (m) => m.PlaylistViewPage,
          ),
      },
      {
        path: 'playlists/edit/:playlistId',
        loadComponent: () =>
          import('../../features/playlist/create-playlist-form/create-playlist-form').then(
            (m) => m.CreatePlaylistForm,
          ),
      },
    ],
  },
];
