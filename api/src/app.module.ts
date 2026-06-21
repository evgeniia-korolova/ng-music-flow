import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { LibraryModule } from './library/library.module';
import { SUPABASE_CLIENT } from './common/constants';
import { createClient } from '@supabase/supabase-js/dist/index.cjs';

@Module({
  imports: [
    AuthModule,
    DataModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'],
    }),
    UsersModule,
    CommonModule,
    LibraryModule,
  ],
  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: SUPABASE_CLIENT,
      inject: [ConfigService],

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      useFactory: (configService: ConfigService) => {
        const supabaseUrl = configService.getOrThrow<string>('SUPABASE_URL');
        const supabaseKey = configService.getOrThrow<string>('SUPABASE_KEY');

        return createClient(supabaseUrl, supabaseKey);
      },
    },
  ],
  exports: [SUPABASE_CLIENT],
})
export class AppModule {}
