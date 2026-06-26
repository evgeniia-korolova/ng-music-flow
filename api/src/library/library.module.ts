import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './entities/track.entity';
import { PlaylistEntity } from './entities/playlist.entity';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { CommonModule } from 'src/common/common.module';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { JamendoModule } from 'src/jamendo/jamendo.module';
import { HistoryEntity } from './entities/history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackEntity, PlaylistEntity, HistoryEntity]),
    CommonModule,
    JamendoModule,
  ],
  controllers: [TracksController, PlaylistsController],
  providers: [TracksService, PlaylistsService],
  exports: [TracksService, PlaylistsService],
})
export class LibraryModule {}
