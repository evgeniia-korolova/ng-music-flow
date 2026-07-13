import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TrackApiService } from './track-api-service';
import { environment } from '../../../../environments/environment';

describe('TrackApiService', () => {
  let service: TrackApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TrackApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get custom track titles', () => {
    const mockTitles = [{ id: '1', title: 'My Awesome Track' }];

    service.getCustomTrackTitles().subscribe((titles) => {
      expect(titles).toEqual(mockTitles);
    });

    const req = httpTestingController.expectOne(`${environment.appApiUrl}/tracks/titles`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTitles);
  });
  it('should upload track', () => {
    const mockFormData = new FormData();
    mockFormData.append('file', 'fake-audio-file');
    const mockResponse = { success: true };

    service.uploadTrack(mockFormData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpTestingController.expectOne(`${environment.appApiUrl}/tracks/upload`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get user tracks', () => {
    const mockTitles = [{ id: '1', title: 'My Awesome Track' }];

    service.getUserTracks().subscribe((titles) => {
      expect(titles).toEqual(mockTitles);
    });

    const req = httpTestingController.expectOne(`${environment.appApiUrl}/tracks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTitles);
  });

  it('should delete track', () => {
    const trackId = '999';
    const mockResponse = { success: true };

    service.deleteTrack(trackId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.appApiUrl}/tracks/${trackId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
