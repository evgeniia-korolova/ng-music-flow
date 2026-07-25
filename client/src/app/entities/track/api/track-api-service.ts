import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CustomTrackTitle,
  PaginatedTracksResponse,
  Track,
  TrackServerResponse,
} from '../model/track.model';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/api/api-response';

@Injectable({
  providedIn: 'root',
})
export class TrackApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.appApiUrl;

  uploadTrack(formData: FormData): Observable<ApiResponse<Track>> {
    return this.http.post<ApiResponse<Track>>(`${this.apiUrl}/tracks/upload`, formData);
  }

  getCustomTrackTitles(): Observable<CustomTrackTitle[]> {
    return this.http.get<CustomTrackTitle[]>(`${this.apiUrl}/tracks/titles`);
  }

  getUserTracks(): Observable<TrackServerResponse<PaginatedTracksResponse>> {
    return this.http.get<TrackServerResponse<PaginatedTracksResponse>>(`${this.apiUrl}/tracks`);
  }
  deleteTrack(trackId: string) {
    return this.http.delete(`${this.apiUrl}/tracks/${trackId}`);
  }
}
