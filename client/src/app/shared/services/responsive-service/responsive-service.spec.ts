import { TestBed } from '@angular/core/testing';

import { ResponsiveService } from './responsive-service';
import { Subject } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { largeScreenWidth, mediumScreenWidth, smallScreenWidth } from '../../constants/breakpoints';

describe('ResponsiveService', () => {
  let service: ResponsiveService;
  let breakpointSubject: Subject<BreakpointState>;

  let mockBreakpointObserver: {
    observe: import('vitest').Mock<(value: string[]) => Subject<BreakpointState>>;
  };

  beforeEach(() => {
    breakpointSubject = new Subject<BreakpointState>();

    mockBreakpointObserver = {
      observe: vi.fn().mockReturnValue(breakpointSubject),
    };

    TestBed.configureTestingModule({
      providers: [
        ResponsiveService,
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
      ],
    });
    service = TestBed.inject(ResponsiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform isSmall to true if it is mobile screen', () => {
    breakpointSubject.next({
      matches: true,
      breakpoints: {
        [smallScreenWidth]: true,
        [mediumScreenWidth]: false,
        [largeScreenWidth]: false,
      },
    });
    expect(service.isSmall()).toBe(true);
    expect(service.isMedium()).toBe(false);
    expect(service.isLarge()).toBe(false);
  });

  it('should transform isLarge to true on descktop', () => {
    breakpointSubject.next({
      matches: true,
      breakpoints: {
        [smallScreenWidth]: false,
        [mediumScreenWidth]: false,
        [largeScreenWidth]: true,
      },
    });

    expect(service.isSmall()).toBe(false);
    expect(service.isMedium()).toBe(false);
    expect(service.isLarge()).toBe(true);
  });
});
