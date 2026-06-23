import { TestBed } from '@angular/core/testing';

import { TrackHistoryService } from './track-history-service';

describe('TrackHistoryService', () => {
  let service: TrackHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
