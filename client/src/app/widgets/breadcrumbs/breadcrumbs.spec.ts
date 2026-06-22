import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Breadcrumbs } from './breadcrumbs';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs/breadcrumbs.service';

describe('Breadcrumbs', () => {
  let component: Breadcrumbs;
  let fixture: ComponentFixture<Breadcrumbs>;

  beforeEach(async () => {
    const mockBreadcrumbsService = {
      breadcrumbs: signal([
        {
          label: 'Home',
          url: '/home',
        },
        { label: 'Discover', url: '/discover' },
      ]),
    };
    await TestBed.configureTestingModule({
      imports: [Breadcrumbs],
      providers: [
        provideRouter([]),
        { provide: BreadcrumbsService, useValue: mockBreadcrumbsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Breadcrumbs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render links correctly', () => {
    const compiled = fixture.nativeElement;
    const link = compiled.querySelectorAll('a');
    expect(link.length).toEqual(1);
  });
});
