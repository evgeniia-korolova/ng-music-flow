import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { GenreId, RawFormValue, SearchFiltersState, SearchState } from './search.model';
import { Track, TrackDto } from '../../../entities/track/model/track.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { combineLatest, debounceTime, finalize, map, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { JamendoApiService } from '../../../shared/api/jamendo-api-service';
import { tapResponse } from '@ngrx/operators';
import { mapTrack } from '../../../shared/lib/map-track';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

const initialState: SearchState = {
  query: '',
  filters: {
    sortBy: 'popularity',
    genres: [],
    durationMin: 0,
    durationMax: 600,
  },
  isLoading: false,
  error: null,
  isInitialized: false,
};

interface ExtendedSearchState extends SearchState {
  tracks: Track[];
}

const extendedInitialState: ExtendedSearchState = {
  ...initialState,
  tracks: [],
};

export const SearchStore = signalStore(
  withState(extendedInitialState),
  withMethods((store) => {
    const jamendoApi = inject(JamendoApiService);
    const router = inject(Router);
    return {
      updateSearchQuery(query: string): void {
        patchState(store, { query });
      },

      setInitialTagFromUrl(tagId: GenreId): void {
        if (store.isInitialized()) return;
        patchState(store, (state) => ({
          ...state,
          filters: {
            ...state.filters,
            genres: [tagId],
          },
        }));
      },

      loadSearchResults: rxMethod<{ query: string; filters: SearchFiltersState }>(
        pipe(
          debounceTime(400),
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(({ query, filters }) => {
            const apiParams: Record<string, string | number | boolean> = {
              limit: 20,
              include: 'stats',
            };

            if (query) {
              apiParams['search'] = query;
            }

            if (filters.genres && filters.genres.length > 0) {
              apiParams['tags'] = filters.genres.join(',');
            }

            apiParams['duration_between'] = `${filters.durationMin}:${filters.durationMax}`;

            if (filters.sortBy === 'popularity') apiParams['order'] = 'popularity_total';
            if (filters.sortBy === 'date') apiParams['order'] = 'releasedate_desc';
            if (filters.sortBy === 'name') apiParams['order'] = 'name_asc';

            return jamendoApi.get<TrackDto>('tracks', apiParams).pipe(
              tapResponse({
                next: (response) => {
                  const allMappedTracks = response.results.map(mapTrack);

                  const richTracks = allMappedTracks.filter((track) => {
                    if (!track.waveform || track.waveform.length === 0) return false;
                    if (track.duration < 30) return false;

                    const loudPeaks = track.waveform.filter((peak) => peak > 0.2).length;
                    return loudPeaks >= 25;
                  });

                  patchState(store, {
                    tracks: richTracks,
                    error: null,
                  });
                },
                error: (err) => {
                  console.error('Error inside SearchStore:', err);
                  patchState(store, {
                    error: 'Failed to load results. Please try once more.',
                  });
                },
              }),
              finalize(() => patchState(store, { isLoading: false })),
            );
          }),
        ),
      ),

      updateFiltersFromForm(formValue: RawFormValue): void {
        if (!store.isInitialized()) {
          patchState(store, { isInitialized: true });
        }

        let activeGenres: string[] = [];

        if (formValue.genres) {
          activeGenres = Object.keys(formValue.genres)
            .filter((genreId) => formValue.genres![genreId] === true)
            .map((genreId) => genreId as GenreId);
        }

        const targetSortBy = formValue.sortBy ?? store.filters.sortBy();
        const targetMin =
          formValue.durationMin !== undefined && formValue.durationMin !== null
            ? +formValue.durationMin
            : store.filters.durationMin();
        const targetMax =
          formValue.durationMax !== undefined && formValue.durationMax !== null
            ? +formValue.durationMax
            : store.filters.durationMax();

        patchState(store, (state) => ({
          ...state,
          filters: {
            ...state.filters,
            genres: activeGenres,
            sortBy: targetSortBy,
            durationMin: targetMin,
            durationMax: targetMax,
          },
        }));

        router.navigate(['/search'], {
          queryParams: {
            tags: activeGenres.length > 0 ? activeGenres.join(',') : null,
            sortBy: targetSortBy === 'popularity' ? null : targetSortBy,

            min: targetMin === 0 ? null : targetMin,
            max: targetMax === 600 ? null : targetMax,
          },
          queryParamsHandling: 'merge',
        });
      },
    };
  }),

  withHooks({
    onInit(store) {
      const query$ = toObservable(store.query);
      const filters$ = toObservable(store.filters);

      const searchTrigger$ = combineLatest([query$, filters$]).pipe(
        map(([query, filters]) => ({ query, filters })),
      );

      store.loadSearchResults(searchTrigger$);
    },
  }),
);
