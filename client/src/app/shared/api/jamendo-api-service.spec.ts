import { TestBed } from '@angular/core/testing';

import { JamendoApiService } from './jamendo-api-service';

describe('JamendoApiService', () => {
  let service: JamendoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JamendoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
