import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Shutdown');
  logger.error('Application failed to start');
  logger.error(err);
  process.exit(1);
});
