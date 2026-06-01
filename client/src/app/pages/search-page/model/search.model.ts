import { GENRES_DATA } from '../../../entities/genre/model/genre.model';

export type GenreId = (typeof GENRES_DATA)[number]['id'];

export type SearchSortOrder = 'popularity' | 'date' | 'title' | 'artist';

export interface RawFormValue {
  readonly sortBy?: SearchSortOrder | string | null;
  readonly genres?: Record<string, boolean | null | undefined> | null;
  readonly durationMin?: number | string | null;
  readonly durationMax?: number | string | null;
}

export interface SearchFiltersState {
  readonly sortBy: string;
  readonly genres: readonly GenreId[];
  readonly durationMin: number;
  readonly durationMax: number;
  isAsc: boolean;
}

export interface SearchState {
  readonly query: string;
  readonly filters: SearchFiltersState;
  readonly isLoading: boolean;
  readonly error: string | null;
  isInitialized: boolean;
  offset: number;
}
