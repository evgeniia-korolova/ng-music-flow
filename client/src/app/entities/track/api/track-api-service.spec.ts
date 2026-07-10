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
});
