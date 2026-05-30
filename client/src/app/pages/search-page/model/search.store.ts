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
    isAsc: true,
  },
  isLoading: false,
  error: null,
  isInitialized: false,
  offset: 0,
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
      if (store.query()) return `Results of search "${store.query()}"`;
      if (store.filters.genres().length > 0)
        return `Results of search: ${store.filters.genres().join(', ')}`;
      return 'All results';
    }),
  })),
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
        // Увеличиваем офсет на 20, чтобы загрузить следующую страницу из сети
        patchState(store, (state) => ({ offset: state.offset + 20 }));
      },

      toggleSortDirection(): void {
        patchState(store, (state) => ({
          ...state,
          filters: {
            ...state.filters,
            isAsc: !state.filters.isAsc,
          },
        }));
      },

      setFiltersFromUrl(params: {
        tags?: string;
        sortBy?: string;
        min?: number;
        max?: number;
        asc?: string;
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
            isAsc: params.asc === 'true',
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
                tracks: searchCache.get(cacheKey) || [],
                isLoading: false,
                error: null,
              });
              return of(null);
            }

            // Эксперимент: Собираем параметры в строгой последовательности!
            // Сначала фильтры и сортировка, а жанры в самый конец объекта
            const apiParams: Record<string, string | number | boolean> = {};

            apiParams['limit'] = 20;
            apiParams['offset'] = offset;
            apiParams['include'] = 'stats';
            if (query) apiParams['search'] = query;
            /*
 Popularity ratings are based on community data: reviews, add-to-favorite, like, dislike, 
 add-to-playlist, downloads and listens, they all contribute with a different weight to shape rating
 */

            //if (filters.sortBy === 'popularity') apiParams['order'] = 'popularity_total';
            if (filters.sortBy === 'popularity') apiParams['order'] = 'listens_total';
            if (filters.sortBy === 'date') apiParams['order'] = 'releasedate_desc';

            apiParams['duration_between'] = `${filters.durationMin}_${filters.durationMax}`;

            if (filters.genres && filters.genres.length > 0) {
              apiParams['fuzzytags'] = filters.genres.join('+');
            }

            return jamendoApi.get<TrackDto>('tracks', apiParams).pipe(
              tapResponse({
                next: (response) => {
                  const allMappedTracks = response.results.map(mapTrack);
                  const richTracks = allMappedTracks.filter((track) => {
                    if (!isValidRichTrack(track)) return false;
                    return (
                      track.duration >= filters.durationMin && track.duration <= filters.durationMax
                    );
                  });

                  const getSortValue = (track: Track): string => {
                    switch (filters.sortBy) {
                      case 'artist':
                        return track.artist.name;
                      case 'title':
                        return track.title;
                      default:
                        return '';
                    }
                  };

                  if (filters.sortBy === 'title' || filters.sortBy === 'artist') {
                    richTracks.sort((a, b) => {
                      const aVal = getSortValue(a);
                      const bVal = getSortValue(b);

                      const cleanA = aVal.replace(/^[^\wа-яёа-щэюяіїєґ0-9]+/i, '');
                      const cleanB = bVal.replace(/^[^\wа-яёа-щэюяіїєґ0-9]+/i, '');

                      const finalA = cleanA || 'zzz';
                      const finalB = cleanB || 'zzz';

                      const result = finalA.localeCompare(finalB, undefined, {
                        sensitivity: 'base',
                        numeric: true,
                      });

                      return filters.isAsc ? result : -result;
                    });
                  }

                  const updatedTracks =
                    offset === 0 ? richTracks : [...store.tracks(), ...richTracks];

                  if (offset === 0) {
                    searchCache.set(cacheKey, richTracks);
                  }

                  patchState(store, { tracks: updatedTracks, error: null });
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
          offset: 0,
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
            asc: store.filters.isAsc() ? 'true' : null,
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

// export const SearchStore = signalStore(
//   withState(extendedInitialState),
//   withComputed((store) => ({
//     listTitle: computed(() => {
//       if (store.query()) {
//         return `Results of search "${store.query()}"`;
//       }
//       if (store.filters.genres().length > 0) {
//         return `Results of search: ${store.filters.genres().join(', ')}`;
//       }
//       return 'All results';
//     }),
//   })),
//   withMethods((store) => {
//     const jamendoApi = inject(JamendoApiService);
//     const router = inject(Router);
//     const searchCache = new Map<string, Track[]>();

//     const createCacheKey = (query: string, filters: SearchFiltersState): string => {
//       const genresKey = filters.genres ? [...filters.genres].sort().join(',') : '';
//       return `q:${query.trim().toLowerCase()}|sort:${filters.sortBy}|genres:${genresKey}|dur:${filters.durationMin}-${filters.durationMax}`;
//     };

//     return {
//       updateSearchQuery(query: string): void {
//         patchState(store, { query });
//       },

//       toggleSortDirection(): void {
//         patchState(store, (state) => ({
//           ...state,
//           filters: {
//             ...state.filters,
//             isAsc: !state.filters.isAsc,
//           }
//         }));
//       },

//       setFiltersFromUrl(params: {
//         tags?: string;
//         sortBy?: string;
//         min?: number;
//         max?: number;
//       }): void {
//         if (store.isInitialized()) return;

//         const activeGenres = params.tags ? (params.tags.split(',') as GenreId[]) : [];

//         patchState(store, (state) => ({
//           ...state,
//           isInitialized: true,
//           filters: {
//             ...state.filters,
//             genres: activeGenres,
//             sortBy: (params.sortBy as SearchSortOrder) ?? store.filters.sortBy(),
//             durationMin: params.min !== undefined ? +params.min : store.filters.durationMin(),
//             durationMax: params.max !== undefined ? +params.max : store.filters.durationMax(),
//           },
//         }));
//       },

//       loadSearchResults: rxMethod<{ query: string; filters: SearchFiltersState }>(
//         pipe(
//           debounceTime(400),
//           tap(() => patchState(store, { isLoading: true, error: null })),
//           switchMap(({ query, filters }) => {
//             const cacheKey = createCacheKey(query, filters);

//             if (searchCache.has(cacheKey)) {
//               const cachedTracks = searchCache.get(cacheKey) || [];

//               patchState(store, {
//                 tracks: cachedTracks,
//                 isLoading: false,
//                 error: null,
//               });

//               return of(null);
//             }

//             patchState(store, { isLoading: true, error: null });

//             const apiParams: Record<string, string | number | boolean> = {
//               limit: 40,
//               include: 'stats',
//             };

//             if (query) {
//               apiParams['search'] = query;
//             }

//             if (filters.genres && filters.genres.length > 0) {
//               apiParams['fuzzytags'] = filters.genres.join('+');
//             }

//             apiParams['duration_between'] = `${filters.durationMin}_${filters.durationMax}`;

//             if (filters.sortBy === 'popularity') apiParams['order'] = 'popularity_total';
//             if (filters.sortBy === 'date') apiParams['order'] = 'releasedate_desc';
//             if (filters.sortBy === 'title' || filters.sortBy === 'artist') apiParams['order'] = filters.isAsc ? 'name_asc' : 'name_desc';

//             return jamendoApi.get<TrackDto>('tracks', apiParams).pipe(
//               tapResponse({
//                 next: (response) => {
//                   const allMappedTracks = response.results.map(mapTrack);

//                   const richTracks = allMappedTracks.filter((track) => {
//                     if (!isValidRichTrack(track)) return false;

//                     if (
//                       track.duration < filters.durationMin ||
//                       track.duration > filters.durationMax
//                     ) {
//                       return false;
//                     }

//                     return true;
//                   });

//                   const sortingStrategies: Record<string, (a: Track, b: Track) => number> = {
//                     title: (a, b) => {
//                       const cleanA = a.title.replace(/^[\s.\-_?]+/, '');
//                       const cleanB = b.title.replace(/^[\s.\-_?]+/, '');
//                       return cleanA.localeCompare(cleanB, undefined, { sensitivity: 'base', numeric: true });
//                     },
//                     artist: (a, b) => {
//                       const artistA = a.artist?.name || '';
//                       const artistB = b.artist?.name || '';
//                       return artistA.localeCompare(artistB, undefined, { sensitivity: 'base' });
//                     },
//                     popularity: (a, b) => b.playCount - a.playCount,
//                     date: (a, b) => (b.releasedate || '').localeCompare(a.releasedate || ''),
//                   };

//                   const currentSortStrategy = sortingStrategies[filters.sortBy];

//                   if (currentSortStrategy) {
//                     // Направление: 1 для возрастания (true), -1 для убывания (false)
//                     const direction = filters.isAsc ? 1 : -1;
//                     richTracks.sort((a, b) => currentSortStrategy(a, b) * direction);
//                   }

//                   searchCache.set(cacheKey, richTracks);

//                   patchState(store, {
//                     tracks: richTracks,
//                     error: null,
//                   });
//                 },
//                 error: (err) => {
//                   console.error('Error inside SearchStore:', err);
//                   patchState(store, {
//                     error: 'Failed to load results. Please try once more.',
//                   });
//                 },
//               }),
//               finalize(() => patchState(store, { isLoading: false })),
//             );
//           }),
//         ),
//       ),

//       updateFiltersFromForm(formValue: RawFormValue): void {
//         if (!store.isInitialized()) {
//           patchState(store, { isInitialized: true });
//         }

//         let activeGenres: string[] = [];

//         if (formValue.genres) {
//           activeGenres = Object.keys(formValue.genres)
//             .filter((genreId) => formValue.genres![genreId] === true)
//             .map((genreId) => genreId as GenreId);
//         }

//         const targetSortBy = formValue.sortBy ?? store.filters.sortBy();
//         const targetMin =
//           formValue.durationMin !== undefined && formValue.durationMin !== null
//             ? +formValue.durationMin
//             : store.filters.durationMin();
//         const targetMax =
//           formValue.durationMax !== undefined && formValue.durationMax !== null
//             ? +formValue.durationMax
//             : store.filters.durationMax();

//         patchState(store, (state) => ({
//           ...state,
//           filters: {
//             ...state.filters,
//             genres: activeGenres,
//             sortBy: targetSortBy,
//             durationMin: targetMin,
//             durationMax: targetMax,
//           },
//         }));

//         router.navigate(['/search'], {
//           queryParams: {
//             tags: activeGenres.length > 0 ? activeGenres.join(',') : null,
//             sortBy: targetSortBy === 'popularity' ? null : targetSortBy,

//             min: targetMin === 0 ? null : targetMin,
//             max: targetMax === 600 ? null : targetMax,
//           },
//           queryParamsHandling: 'merge',
//         });
//       },
//     };
//   }),

//   withHooks({
//     onInit(store) {
//       const query$ = toObservable(store.query);
//       const filters$ = toObservable(store.filters);

//       const searchTrigger$ = combineLatest([query$, filters$]).pipe(
//         map(([query, filters]) => ({ query, filters })),
//       );

//       store.loadSearchResults(searchTrigger$);
//     },
//   }),
// );
