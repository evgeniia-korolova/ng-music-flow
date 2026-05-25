import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { GENRES_DATA } from '../../../entities/genre/model/genre.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DurationPipe } from '../../../shared/ui/pipes/duration-pipe';
import { SearchStore } from '../../../pages/search-page/model/search.store';

@Component({
  selector: 'app-search-filters',
  imports: [ReactiveFormsModule, DurationPipe],
  templateUrl: './search-filters.html',
  styleUrl: './search-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilters implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly store = inject(SearchStore);
  private readonly destroyRef = inject(DestroyRef);

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
    effect(() => {
      const activeGenresInStore = this.store.filters.genres();

      const genresUpdate: Record<string, boolean> = {};
      this.genresList.forEach((genre) => {
        genresUpdate[genre.id] = activeGenresInStore.includes(genre.id);
      });

      this.filterForm.patchValue(
        {
          genres: genresUpdate,
          sortBy: this.store.filters.sortBy(),
          durationMin: this.store.filters.durationMin(),
          durationMax: this.store.filters.durationMax(),
        },
        { emitEvent: false },
      );
    });

    // this.filterForm.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
    //   const currentFormValue = this.filterForm.getRawValue();
    //   const min = currentFormValue.durationMin ?? 0;
    //   const max = currentFormValue.durationMax ?? 600;
    //   if (min > max) {
    //     this.filterForm.patchValue({ durationMin: max }, { emitEvent: false });
    //     return;
    //   }
    //   this.store.updateFiltersFromForm(value);
    // });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(
        // Передаем destroyRef, так как мы находимся в ngOnInit, а не в конструкторе
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        const currentFormValue = this.filterForm.getRawValue();
        const min = currentFormValue.durationMin ?? 0;
        const max = currentFormValue.durationMax ?? 600;

        if (min > max) {
          this.filterForm.patchValue({ durationMin: max }, { emitEvent: false });
          return;
        }

        this.store.updateFiltersFromForm(value);
      });
  }
}
