import { environment } from '../../../environments/environment';

export function connectToJamendo(token: string | null): void {
  if (!token) {
    console.error('User token not found');
    return;
  }

  const endpoint = `${environment.appApiUrl}/auth/jamendo/`;

  globalThis.location.href = `${endpoint}?state=${token}`;
}
