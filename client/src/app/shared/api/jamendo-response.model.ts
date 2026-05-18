export interface JamendoResponse<T> {
  headers: {
    status: string;
    code: number;
    results_count: number;
    error_message?: string;
  };
  results: T[];
}
