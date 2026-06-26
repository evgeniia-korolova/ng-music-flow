import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JamendoClient } from './jamendo-client';
import { JamendoService } from './jamendo.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [AuthModule, ConfigModule, UsersModule],
  providers: [JamendoClient, JamendoService],
  exports: [JamendoClient, JamendoService],
})
export class JamendoModule {}
