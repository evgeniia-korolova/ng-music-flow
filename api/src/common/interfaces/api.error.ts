export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export type ApiErrorPayload = Omit<ApiError, 'status'>;
