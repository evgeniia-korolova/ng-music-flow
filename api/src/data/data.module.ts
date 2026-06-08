import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('ENVIRONMENT') === 'production';

        return {
          type: 'postgres',
          url: isProduction
            ? configService.get<string>('DATABASE_URL')
            : undefined,
          host: isProduction ? undefined : configService.get<string>('DB_HOST'),
          port: isProduction ? undefined : configService.get<number>('DB_PORT'),
          username: isProduction
            ? undefined
            : configService.get<string>('DB_USERNAME'),
          password: isProduction
            ? undefined
            : configService.get<string>('DB_PASSWORD'),
          database: isProduction
            ? undefined
            : configService.get<string>('DB_DATABASE'),
          ssl: isProduction ? { rejectUnauthorized: false } : undefined,

          autoLoadEntities: true,
          logging: true,
          synchronize: !isProduction,
          dropSchema: false,
        };
      },
    }),
  ],
})
export class DataModule {}
