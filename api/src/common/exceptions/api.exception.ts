import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiErrorPayload } from '../interfaces/api.error';

export class ApiException extends HttpException {
  constructor(payload: ApiErrorPayload, status: HttpStatus) {
    super(payload, status);
  }
}
