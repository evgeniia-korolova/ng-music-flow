import { ApiError } from './api.error';

export type ApiResponse<T> =
  | { data: T | null; error: null }
  | { data: null; error: ApiError };
