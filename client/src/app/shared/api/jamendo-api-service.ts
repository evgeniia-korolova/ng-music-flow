import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JamendoResponse } from './jamendo-response.model';
import { catchError, map, of, retry, timer } from 'rxjs';

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

    return this.http
      .get<JamendoResponse<T>>(`${this.baseUrl}/${endpoint}/`, {
        params: httpParams,
      })
      .pipe(
        map((response) => {
          const status = response?.headers?.status;
          const count = response?.headers?.results_count;

          if (status === 'success' && count === 0) {
            throw new Error('Jamendo Throttling: Empty array');
          }

          return response;
        }),
        retry({
          count: 3,
          delay: (error, retryCount) => {
            console.warn(`Retry querry №${retryCount} because of: ${error.message}`);
            const delayTime = retryCount * 1500;
            return timer(delayTime);
          },
        }),
        catchError((err) => {
          console.error('Jamendo API critically failed after all retries:', err.message);
          return of({
            headers: { status: 'success', results_count: 0 },
            results: [],
          } as unknown as JamendoResponse<T>);
        }),
      );
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
