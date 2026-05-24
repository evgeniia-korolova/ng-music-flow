import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { GENRES_DATA } from '../../../entities/genre/model/genre.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DurationPipe } from '../../../shared/ui/pipes/duration-pipe';

@Component({
  selector: 'app-search-filters',
  imports: [ReactiveFormsModule, DurationPipe],
  templateUrl: './search-filters.html',
  styleUrl: './search-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilters {
  private readonly fb = inject(FormBuilder);

  protected readonly genresList = GENRES_DATA;

  readonly filterForm = this.fb.group({
    sortBy: this.fb.control<string>('popularity'),

    genres: this.fb.group(
      this.genresList.reduce(
        (acc, genre) => {
          acc[genre.id] = this.fb.control<boolean>(false);
          return acc;
        },
        {} as Record<string, FormControl<boolean | null>>,
      ),
    ),

    durationMin: this.fb.control<number>(0),
    durationMax: this.fb.control<number>(600),
  });

  constructor() {
    this.filterForm.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const currentFormValue = this.filterForm.getRawValue();
      const min = currentFormValue.durationMin ?? 0;
      const max = currentFormValue.durationMax ?? 600;
      if (min > max) {
        this.filterForm.patchValue(
          {
            durationMin: max,
          },
          { emitEvent: false },
        );
      }
      console.log('Filter changed:', value);
    });
  }
}
