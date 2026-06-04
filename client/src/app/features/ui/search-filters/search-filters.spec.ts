import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFilters } from './search-filters';
import { ReactiveFormsModule } from '@angular/forms';
import { DurationPipe } from '../../../shared/ui/pipes/duration-pipe';
import { SearchStore } from '../../../pages/search-page/model/search.store';
import { Router } from '@angular/router';

describe('SearchFilters', () => {
  let component: SearchFilters;
  let fixture: ComponentFixture<SearchFilters>;
  let mockRouter: { navigate: import('vitest').Mock<() => Promise<boolean>> };

  beforeEach(async () => {
    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };
    await TestBed.configureTestingModule({
      imports: [SearchFilters, ReactiveFormsModule, DurationPipe],
      providers: [SearchStore, { provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form with default value', () => {
    const formValue = component.filterForm.value;

    expect(formValue.sortBy).toBe('popularity');
    expect(formValue.durationMin).toBe(30);
    expect(formValue.durationMax).toBe(600);
    expect(formValue.genres?.['rock']).toBe(false);
    expect(formValue.genres?.['pop']).toBe(false);
  });

  it('should update checkbox state when genre is changed', () => {
    const rockControl = component.filterForm.get('genres.rock');
    expect(rockControl?.value).toBe(false);

    rockControl?.setValue(true);
    fixture.detectChanges();

    expect(component.filterForm.value.genres?.['rock']).toBe(true);
  });

  it('should protect against slider overlap and align min under max if min > max', () => {
    fixture.detectChanges();

    component.filterForm.patchValue({
      durationMin: 300,
      durationMax: 200,
    });

    fixture.detectChanges();

    expect(component.filterForm.value.durationMin).toBe(200);
    expect(component.filterForm.value.durationMax).toBe(200);
  });
});
