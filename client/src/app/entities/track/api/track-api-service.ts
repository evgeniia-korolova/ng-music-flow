import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomTrackTitle } from '../model/track.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrackApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.appApiUrl;

  uploadTrack(formData: FormData) {
    return this.http.post(`${this.apiUrl}/tracks/upload`, formData);
  }

  getCustomTrackTitles(): Observable<CustomTrackTitle[]> {
    return this.http.get<CustomTrackTitle[]>(`${this.apiUrl}/tracks/titles`);
  }
}
