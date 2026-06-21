import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './entities/track.entity';
import { PlaylistEntity } from './entities/playlist.entity';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackEntity, PlaylistEntity]),
    CommonModule,
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class LibraryModule {}
