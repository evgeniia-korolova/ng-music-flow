import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const environment = configService.get<string>('ENVIRONMENT');
        //const isProduction =
        //configService.get<string>('ENVIRONMENT') === 'production';
        const isProduction = environment === 'production';

        return {
          // type: 'postgres',
          // url: isProduction
          //   ? configService.get<string>('DATABASE_URL')
          //   : undefined,
          // host: isProduction ? undefined : configService.get<string>('DB_HOST'),
          // port: isProduction ? undefined : configService.get<number>('DB_PORT'),
          // username: isProduction
          //   ? undefined
          //   : configService.get<string>('DB_USERNAME'),
          // password: isProduction
          //   ? undefined
          //   : configService.get<string>('DB_PASSWORD'),
          // database: isProduction
          //   ? undefined
          //   : configService.get<string>('DB_DATABASE'),
          // ssl: isProduction ? { rejectUnauthorized: false } : undefined,

          // autoLoadEntities: true,
          // logging: true,
          // synchronize: !isProduction,
          // dropSchema: false,
          type: 'postgres',
          // Всегда используем готовую строку подключения DATABASE_URL
          url: configService.get<string>('DATABASE_URL'),
          // SSL нужен для внешних подключений к Supabase (Koyeb/Render потребуют его в prod)
          ssl: { rejectUnauthorized: false },
          autoLoadEntities: true,
          logging: true,
          // Синхронизация включена ТОЛЬКО если это не production
          synchronize: !isProduction,
          dropSchema: false,
        };
      },
    }),
  ],
})
export class DataModule {}
