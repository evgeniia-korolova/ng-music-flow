import { PlaylistResponseDto } from './playlist-dto.interface';
import { LibraryPlaylist, LibraryPlaylistTrack } from './playlist.model';

//распаковка сложного объекта в плоский фронт
export function mapPlaylistResponseToLibraryPlaylist(dto: PlaylistResponseDto): LibraryPlaylist {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description || '',
    createdAt: dto.createdAt,

    tracks: (dto.tracks || []).map(
      (t): LibraryPlaylistTrack => ({
        ...t.track,
        origin: t.origin,
        order: t.order,
      }),
    ),
  };
}
