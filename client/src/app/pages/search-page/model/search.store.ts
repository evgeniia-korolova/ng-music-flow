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
import { combineLatest, debounceTime, delay, finalize, map, of, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { JamendoApiService } from '../../../shared/api/jamendo-api-service';
import { tapResponse } from '@ngrx/operators';
import { mapTrack } from '../../../entities/track/lib/map-track';
import { toObservable } from '@angular/core/rxjs-interop';
import { isValidRichTrack } from '../../../entities/track/model/track.validator';

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
  { providedIn: 'root' },
  withState(extendedInitialState),
  withComputed((store) => {
    return {
      tracks: store.rawTracks,
      listTitle: computed(() => {
        const query = store.query().trim();
        const genres = store.filters().genres;

        if (!query && genres.length === 0) {
          return 'All results';
        }

        const searchParts: string[] = [];

        if (query) {
          searchParts.push(query);
        }

        if (genres.length > 0) {
          searchParts.push(...genres);
        }

        return `Results of search: ${searchParts.join(', ')}`;
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
    const searchCache = new Map<string, Track[]>();

    const createCacheKey = (query: string, filters: SearchFiltersState): string => {
      const genresKey = filters.genres ? [...filters.genres].sort().join(',') : '';
      return `q:${query.trim().toLowerCase()}|sort:${filters.sortBy}|genres:${genresKey}|dur:${filters.durationMin}-${filters.durationMax}|asc:${filters.isAsc}`;
    };

    return {
      setQuery(query: string): void {
        patchState(store, { query, offset: 0 });
      },

      loadMore(): void {
        patchState(store, (state) => ({ offset: state.offset + 10 }));
      },

      toggleSortDirection(): void {
        const currentFilters = store.filters();
        patchState(store, {
          offset: 0,
          filters: {
            ...currentFilters,
            isAsc: !currentFilters.isAsc,
          },
        });
      },

      setGenre(genre: GenreId): void {
        const currentFilters = store.filters();
        patchState(store, {
          offset: 0,
          filters: {
            ...currentFilters,
            genres: [genre],
          },
        });
      },

      loadSearchResults: rxMethod<{ query: string; filters: SearchFiltersState; offset: number }>(
        pipe(
          debounceTime(400),
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(({ query, filters, offset }) => {
            const cacheKey = createCacheKey(query, filters);

            if (offset === 0 && searchCache.has(cacheKey)) {
              const cachedTracks = searchCache.get(cacheKey) || [];
              return of({
                results: cachedTracks,
                headers: { results_fullcount: store.totalCount() },
              }).pipe(delay(0));
            }

            const apiParams: Record<string, string | number | boolean> = {};
            const isSearchMode = query.trim().length > 0;

            apiParams['limit'] = 10;
            apiParams['offset'] = offset;
            apiParams['include'] = 'stats+musicinfo';
            //if (query) apiParams['search'] = query;
            if (offset === 0) {
              apiParams['fullcount'] = true;
            }

            if (isSearchMode) {
              apiParams['search'] = query;

              apiParams['durationbetween'] = `${filters.durationMin}_${filters.durationMax}`;
              if (filters.sortBy === 'popularity') apiParams['order'] = 'listens_total';
              if (filters.sortBy === 'date') apiParams['order'] = 'releasedate_desc';

              if (filters.sortBy === 'title')
                apiParams['order'] = filters.isAsc ? 'name_asc' : 'name_desc';
              if (filters.sortBy === 'artist')
                apiParams['order'] = filters.isAsc ? 'artist_name_asc' : 'artist_name_desc';

              if (filters.genres && filters.genres.length > 0) {
                apiParams['fuzzytags'] = filters.genres.join('+');
              } //не работает
            } else {
              apiParams['durationbetween'] = `${filters.durationMin}_${filters.durationMax}`;
              if (filters.sortBy === 'popularity') apiParams['order'] = 'listens_total';

              if (filters.sortBy === 'date') apiParams['order'] = 'releasedate_desc';

              if (filters.genres && filters.genres.length > 0) {
                apiParams['fuzzytags'] = filters.genres.join('+');
              }
              if (filters.sortBy === 'title')
                apiParams['order'] = filters.isAsc ? 'name_asc' : 'name_desc';
              if (filters.sortBy === 'artist')
                apiParams['order'] = filters.isAsc ? 'artist_name_asc' : 'artist_name_desc';
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
        const activeGenres = (
          formValue.genres
            ? Object.keys(formValue.genres).filter((id) => formValue.genres![id] === true)
            : []
        ) as GenreId[];

        const currentFilters = store.filters();

        patchState(store, {
          offset: 0,
          filters: {
            ...currentFilters,
            genres: activeGenres,
            sortBy: (formValue.sortBy as SearchSortOrder) ?? currentFilters.sortBy,
            durationMin:
              formValue.durationMin != null ? +formValue.durationMin : currentFilters.durationMin,
            durationMax:
              formValue.durationMax != null ? +formValue.durationMax : currentFilters.durationMax,
          },
        });
      },

      resetFilters(): void {
        patchState(store, {
          filters: {
            sortBy: 'popularity',
            genres: [],
            durationMin: 30,
            durationMax: 600,
            isAsc: true,
          },
          offset: 0,
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
