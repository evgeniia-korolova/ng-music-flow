// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SUPABASE_CLIENT } from './constants';
import { createClient } from '@supabase/supabase-js/dist/index.cjs';

@Module({
  providers: [
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
export class CommonModule {}
