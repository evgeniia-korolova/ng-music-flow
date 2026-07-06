import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JamendoResponse } from './jamendo-response.model';

@Injectable({
  providedIn: 'root',
})
export class JamendoApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly clientId = environment.jamendoClientId;

  get<T>(endpoint: string, params: Record<string, string | number | boolean> = {}) {
    const httpParams = new HttpParams({
      fromObject: {
        ...params,
        ...(this.clientId ? { client_id: this.clientId } : {}),
        format: 'json',
      },
    });

    return this.http.get<JamendoResponse<T>>(`${this.baseUrl}/${endpoint}/`, {
      params: httpParams,
    });
  }

  redirectToAuth(): void {
    const jamendoAuthUrl = `${environment.appApiUrl}/auth/jamendo`;

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: jamendoAuthUrl,
      response_type: 'code',
      scope: 'music profile',
    });

    globalThis.location.href = `${jamendoAuthUrl}?${params.toString()}`;
  }
}
