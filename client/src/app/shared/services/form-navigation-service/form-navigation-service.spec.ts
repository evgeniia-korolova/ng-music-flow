import { TestBed } from '@angular/core/testing';

import { FormNavigationService } from './form-navigation-service';

describe('FormNavigationService', () => {
  let service: FormNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
