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
import { sortTracks } from '../../../entities/track/model/sort-tracks';

const initialState: SearchState = {
  query: '',
  filters: {
    sortBy: 'popularity',
    genres: [],
    durationMin: 30,
    durationMax: 600,
    isAsc: true, //от A до Z
  },
  isLoading: false,
  error: null,
  isInitialized: false,
  offset: 0,
  totalCount: null,
};

interface ExtendedSearchState extends SearchState {
  rawTracks: Track[];
}

const extendedInitialState: ExtendedSearchState = {
  ...initialState,
  rawTracks: [],
};

export const SearchStore = signalStore(
  withState(extendedInitialState),
  withComputed((store) => {
    const sortedTracksSignal = computed(() => {
      const raw = store.rawTracks();
      const sortBy = store.filters.sortBy();
      const isAsc = store.filters.isAsc();

      if (sortBy === 'title' || sortBy === 'artist') {
        return sortTracks(raw, sortBy, isAsc);
      }
      return raw;
    });

    return {
      tracks: sortedTracksSignal,
      listTitle: computed(() => {
        if (store.query()) return `Results of search "${store.query()}"`;
        if (store.filters.genres().length > 0)
          return `Results of search: ${store.filters.genres().join(', ')}`;
        return 'All results';
      }),

      hasMore: computed(() => {
        const total = store.totalCount();
        if (total === null) return false;
        return store.rawTracks().length < total;
      }),
    };
  }),

  withMethods((store) => {
    const jamendoApi = inject(JamendoApiService);
    const router = inject(Router);
    const searchCache = new Map<string, Track[]>();

    const createCacheKey = (query: string, filters: SearchFiltersState): string => {
      const genresKey = filters.genres ? [...filters.genres].sort().join(',') : '';
      return `q:${query.trim().toLowerCase()}|sort:${filters.sortBy}|genres:${genresKey}|dur:${filters.durationMin}-${filters.durationMax}|asc:${filters.isAsc}`;
    };

    return {
      updateSearchQuery(query: string): void {
        patchState(store, { query });
      },

      loadMore(): void {
        // Увеличиваем офсет на 10, чтобы загрузить следующую страницу из сети
        patchState(store, (state) => ({ offset: state.offset + 10 }));
      },

      toggleSortDirection(): void {
        patchState(store, (state) => ({
          ...state,
          filters: {
            ...state.filters,
            isAsc: !state.filters.isAsc,
          },
        }));
        window.scrollTo({ top: 0 });
      },

      setFiltersFromUrl(params: {
        query?: string;
        tags?: string;
        sortBy?: string;
        min?: number;
        max?: number;
        asc?: string;
      }): void {
        if (store.isInitialized()) return;
        const activeGenres = params.tags ? (params.tags.split(',') as GenreId[]) : [];

        const targetQuery = params.query ?? '';

        patchState(store, (state) => ({
          ...state,
          isInitialized: true,
          query: targetQuery,
          filters: {
            ...state.filters,
            genres: activeGenres,
            sortBy: (params.sortBy as SearchSortOrder) ?? store.filters.sortBy(),
            durationMin: params.min !== undefined ? +params.min : store.filters.durationMin(),
            durationMax: params.max !== undefined ? +params.max : store.filters.durationMax(),
            isAsc: params.asc !== undefined ? params.asc === 'true' : store.filters.isAsc(),
          },
        }));
      },

      loadSearchResults: rxMethod<{ query: string; filters: SearchFiltersState; offset: number }>(
        pipe(
          debounceTime(400),
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(({ query, filters, offset }) => {
            const cacheKey = createCacheKey(query, filters);

            if (offset === 0 && searchCache.has(cacheKey)) {
              patchState(store, {
                rawTracks: searchCache.get(cacheKey) || [],
                isLoading: false,
                error: null,
              });
              return of(null);
            }

            const apiParams: Record<string, string | number | boolean> = {};

            apiParams['limit'] = 10;
            apiParams['offset'] = offset;
            apiParams['include'] = 'stats';
            if (query) apiParams['search'] = query;
            if (offset === 0) {
              apiParams['fullcount'] = true;
            }

            //if (filters.sortBy === 'popularity') apiParams['order'] = 'popularity_total';
            if (filters.sortBy === 'popularity') apiParams['order'] = 'listens_total';
            if (filters.sortBy === 'date') apiParams['order'] = 'releasedate_desc';

            apiParams['durationbetween'] = `${filters.durationMin}_${filters.durationMax}`;

            if (filters.genres && filters.genres.length > 0) {
              apiParams['fuzzytags'] = filters.genres.join('+');
            }

            return jamendoApi.get<TrackDto>('tracks', apiParams).pipe(
              tapResponse({
                next: (response) => {
                  const richTracks = response.results.map(mapTrack).filter(isValidRichTrack);
                  const currentTracks = store.rawTracks();
                  const filteredNewTracks =
                    offset === 0
                      ? richTracks
                      : richTracks.filter(
                          (newTrack) => !currentTracks.some((old) => old.id === newTrack.id),
                        );

                  const updatedTracks =
                    offset === 0 ? filteredNewTracks : [...currentTracks, ...filteredNewTracks];

                  if (offset === 0) {
                    searchCache.set(cacheKey, richTracks);
                  }

                  const totalCount = response.headers.results_fullcount ?? store.totalCount();

                  patchState(store, {
                    rawTracks: updatedTracks,
                    error: null,
                    totalCount,
                  });
                },
                error: (err) => {
                  console.error('Error inside SearchStore:', err);
                  patchState(store, { error: 'Failed to load results.' });
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
        let activeGenres: GenreId[] = [];
        if (formValue.genres) {
          activeGenres = Object.keys(formValue.genres)
            .filter((genreId) => formValue.genres![genreId] === true)
            .map((genreId) => genreId as GenreId);
        }

        const targetSortBy: SearchSortOrder =
          (formValue.sortBy as SearchSortOrder) ?? store.filters.sortBy();
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
          offset: 0,
          filters: {
            ...state.filters,
            genres: activeGenres,
            sortBy: targetSortBy,
            durationMin: targetMin,
            durationMax: targetMax,
          },
          rawTracks: [],
        }));

        router.navigate(['/search'], {
          queryParams: {
            query: store.query() || null,
            offset: 0,
            tags: activeGenres.length > 0 ? activeGenres.join(',') : null,
            sortBy: targetSortBy === 'popularity' ? null : targetSortBy,
            min: targetMin === 0 ? null : targetMin,
            max: targetMax === 600 ? null : targetMax,
            asc: store.filters.isAsc() ? 'true' : 'false',
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
      const offset$ = toObservable(store.offset);
      const searchTrigger$ = combineLatest([query$, filters$, offset$]).pipe(
        map(([query, filters, offset]) => ({ query, filters, offset })),
      );
      store.loadSearchResults(searchTrigger$);
    },
  }),
);
