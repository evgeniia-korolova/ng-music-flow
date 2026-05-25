import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  GenreId,
  RawFormValue,
  SearchFiltersState,
  SearchSortOrder,
  SearchState,
} from './search.model';
import { Track, TrackDto } from '../../../entities/track/model/track.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { combineLatest, debounceTime, finalize, map, of, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { JamendoApiService } from '../../../shared/api/jamendo-api-service';
import { tapResponse } from '@ngrx/operators';
import { mapTrack } from '../../../entities/track/lib/map-track';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { isValidRichTrack } from '../../../entities/track/model/track.validator';

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
  withComputed((store) => ({
    listTitle: computed(() => {
      if (store.query()) {
        return `Results of search "${store.query()}"`;
      }
      if (store.filters.genres().length > 0) {
        return `Results of search: ${store.filters.genres().join(', ')}`;
      }
      return 'All results';
    }),
  })),
  withMethods((store) => {
    const jamendoApi = inject(JamendoApiService);
    const router = inject(Router);
    const searchCache = new Map<string, Track[]>();

    const createCacheKey = (query: string, filters: SearchFiltersState): string => {
      const genresKey = filters.genres ? [...filters.genres].sort().join(',') : '';
      return `q:${query.trim().toLowerCase()}|sort:${filters.sortBy}|genres:${genresKey}|dur:${filters.durationMin}-${filters.durationMax}`;
    };

    return {
      updateSearchQuery(query: string): void {
        patchState(store, { query });
      },

      setFiltersFromUrl(params: {
        tags?: string;
        sortBy?: string;
        min?: number;
        max?: number;
      }): void {
        if (store.isInitialized()) return;

        const activeGenres = params.tags ? (params.tags.split(',') as GenreId[]) : [];

        patchState(store, (state) => ({
          ...state,
          isInitialized: true,
          filters: {
            ...state.filters,
            genres: activeGenres,
            sortBy: (params.sortBy as SearchSortOrder) ?? store.filters.sortBy(),
            durationMin: params.min !== undefined ? +params.min : store.filters.durationMin(),
            durationMax: params.max !== undefined ? +params.max : store.filters.durationMax(),
          },
        }));
      },

      loadSearchResults: rxMethod<{ query: string; filters: SearchFiltersState }>(
        pipe(
          debounceTime(400),
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(({ query, filters }) => {
            const cacheKey = createCacheKey(query, filters);

            if (searchCache.has(cacheKey)) {
              const cachedTracks = searchCache.get(cacheKey) || [];

              patchState(store, {
                tracks: cachedTracks,
                isLoading: false,
                error: null,
              });

              return of(null);
            }

            patchState(store, { isLoading: true, error: null });

            const apiParams: Record<string, string | number | boolean> = {
              limit: 20,
              include: 'stats',
            };

            if (query) {
              apiParams['search'] = query;
            }

            if (filters.genres && filters.genres.length > 0) {
              apiParams['tags'] = filters.genres.join('+');
            }

            apiParams['duration_between'] = `${filters.durationMin}:${filters.durationMax}`;

            if (filters.sortBy === 'popularity') apiParams['order'] = 'popularity_total';
            if (filters.sortBy === 'date') apiParams['order'] = 'releasedate_desc';
            if (filters.sortBy === 'name') apiParams['order'] = 'name_asc';

            return jamendoApi.get<TrackDto>('tracks', apiParams).pipe(
              tapResponse({
                next: (response) => {
                  const allMappedTracks = response.results.map(mapTrack);

                  const richTracks = allMappedTracks.filter(isValidRichTrack);

                  searchCache.set(cacheKey, richTracks);

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
