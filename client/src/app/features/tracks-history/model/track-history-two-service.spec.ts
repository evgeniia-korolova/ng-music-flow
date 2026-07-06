import { TestBed } from '@angular/core/testing';

import { TrackHistoryTwoService } from './track-history-two-service';

describe('TrackHistoryTwoService', () => {
  let service: TrackHistoryTwoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackHistoryTwoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
