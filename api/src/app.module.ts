import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
