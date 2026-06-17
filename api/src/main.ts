import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ApiResponseInterceptor } from './common/interceptors/api-response/api.response.interceptor';
import { ApiExceptionFilter } from './common/filters/api-exception/api.exception.filter';
import * as dotenv from 'dotenv';
import * as path from 'node:path';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  const result = dotenv.config({ path: path.resolve(__dirname, '../../.env') });

  if (result.error) {
    console.error(
      'failed to file .env file in root directory',
      path.resolve(__dirname, '../../.env'),
    );
  }

  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.ENVIRONMENT === 'production';

  const apiPort = process.env.API_PORT ?? 3000;
  const clientPort = process.env.CLIENT_PORT ?? 4200;

  const corsOrigin = isProduction
    ? process.env.HOSTED_CLIENT
    : `http://localhost:${clientPort}`;

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalInterceptors(new ApiResponseInterceptor());

  app.useGlobalFilters(new ApiExceptionFilter());

  const jwtSecret = process.env['JWT_SECRET'];

  if (!jwtSecret) {
    console.error('JWT Secret is missing');
    return;
  }

  await app.listen(apiPort);
  logger.log(`Application is running on: http://localhost:${apiPort}`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Shutdown');
  logger.error('Application failed to start');
  logger.error(err);
  process.exit(1);
});
