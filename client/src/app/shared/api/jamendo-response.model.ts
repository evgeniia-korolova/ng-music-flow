export interface JamendoResponseHeaders {
  status: string;
  code: number;
  results_count: number;
  results_fullcount?: number;
  next?: string;
  warnings?: string;
  error_message?: string;
}

export interface JamendoResponse<T> {
  headers: JamendoResponseHeaders;
  results: T[];
}
