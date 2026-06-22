import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JamendoClient } from './jamendo/jamendo-client';

@Module({
  imports: [AuthModule],
  providers: [JamendoClient],
  exports: [JamendoClient],
})
export class JamendoModule {}
