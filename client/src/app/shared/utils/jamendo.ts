import { environment } from '../../../environments/environment';

export function connectToJamendo(token: string | null): void {
  if (!token) {
    console.error('User token not found');
    return;
  }

  const endpoint = environment.production
    ? 'https://ng-music-flow.onrender.com/auth/jamendo'
    : `${environment.appApiUrl}/auth/jamendo`.replace(/\/+$/, '');

  globalThis.location.href = `${endpoint}?state=${token}`;
}
