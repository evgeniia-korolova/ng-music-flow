import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from 'src/common/exceptions/api.exception';
import { ApiResponse } from 'src/common/interfaces/api.response';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server error';
    let code: string | undefined = undefined;

    if (exception instanceof ApiException) {
      status = exception.getStatus();
      const payload = exception.getResponse() as {
        message: string;
        code?: string;
      };

      message = payload.message;
      code = payload.code;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        message = payload;
      } else if (payload !== null && typeof payload === 'object') {
        const body = payload as { message?: string | string[]; code?: string };

        if (Array.isArray(body.message)) {
          message = body.message.join(', ');
        } else if (typeof body.message === 'string') {
          message = body.message;
        }

        code = body.code;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ApiResponse<null> = {
      data: null,
      error: {
        status,
        message,
        code,
      },
    };

    response.status(status).json(errorResponse);
  }
}
