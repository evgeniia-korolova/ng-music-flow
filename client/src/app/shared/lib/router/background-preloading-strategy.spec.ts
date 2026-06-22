import { TestBed } from '@angular/core/testing';

import { BackgroundPreloadingStrategy } from './background-preloading-strategy';

describe('BackgroundPreloadingStrategy', () => {
  let service: BackgroundPreloadingStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundPreloadingStrategy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
