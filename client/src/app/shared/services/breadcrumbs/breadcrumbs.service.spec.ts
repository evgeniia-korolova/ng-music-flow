import { TestBed } from '@angular/core/testing';

import { BreadcrumbsService } from './breadcrumbs.service';
import { Subject } from 'rxjs';
import { Event, NavigationEnd, Router } from '@angular/router';

describe('Breadcrumbs', () => {
  let service: BreadcrumbsService;
  const mockEvents = new Subject<Event>();
  const mockRouter = {
    events: mockEvents.asObservable(),
    routerState: { snapshot: { root: {} } },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
    service = TestBed.inject(BreadcrumbsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should update breadcrumbs on NavigationEnd', () => {
    mockRouter.routerState.snapshot.root = {
      title: 'Discover',
      firstChild: null,
      url: [{ path: 'discover' }],
      data: {},
    };
    mockEvents.next(new NavigationEnd(1, '/discover', '/discover'));
    expect(service.breadcrumbs()).toEqual([{ label: 'Discover', url: '/discover' }]);
  });
});
