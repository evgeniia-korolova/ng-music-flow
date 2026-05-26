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
        // client_id: this.clientId,
        ...(this.clientId ? { client_id: this.clientId } : {}),
        format: 'json',
        ...params,
      },
    });

    return this.http.get<JamendoResponse<T>>(`${this.baseUrl}/${endpoint}/`, {
      params: httpParams,
    });
  }
}
