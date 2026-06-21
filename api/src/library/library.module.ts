import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './entities/track.entity';
import { PlaylistEntity } from './entities/playlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity, PlaylistEntity])],
})
export class LibraryModule {}
