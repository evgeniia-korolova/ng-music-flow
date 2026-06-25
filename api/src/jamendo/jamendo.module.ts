import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JamendoClient } from './jamendo-client';
import { JamendoService } from './jamendo.service';

@Module({
  imports: [AuthModule],
  providers: [JamendoClient, JamendoService],
  exports: [JamendoClient, JamendoService],
})
export class JamendoModule {}
