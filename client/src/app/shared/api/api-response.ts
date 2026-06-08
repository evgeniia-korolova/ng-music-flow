export type ApiResponse<T> = { data: T; error: null } | { data: null; error: ApiError };

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
