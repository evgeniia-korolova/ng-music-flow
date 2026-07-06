import { TestBed } from '@angular/core/testing';

import { JamendoApiService } from './jamendo-api-service';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('JamendoApiService', () => {
  let service: JamendoApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(JamendoApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send GET request', () => {
    service.get('tracks').subscribe();

    const request: TestRequest = httpTestingController.expectOne(
      (req) => req.url === `${environment.apiUrl}/tracks/`,
    );

    expect(request.request.method).toBe('GET');

    request.flush({
      results: [],
    });
  });

  it('should not allow overriding service params and keep system defaults', () => {
    (service as unknown as { clientId: string })['clientId'] = 'MOCK_SYSTEM_CLIENT_ID';

    service
      .get('tracks', {
        client_id: 'FAKE_CLIENT',
        format: 'xml',
        limit: 10,
      })
      .subscribe();

    const request = httpTestingController.expectOne(
      (req) => req.url === `${environment.apiUrl}/tracks/`,
    );

    expect(request.request.method).toBe('GET');

    expect(request.request.params.get('limit')).toBe('10');

    expect(request.request.params.get('client_id')).toBe('MOCK_SYSTEM_CLIENT_ID');
    expect(request.request.params.get('format')).toBe('json');

    request.flush({
      results: [],
    });
  });
});
