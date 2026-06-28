import { PlaylistResponseDto } from './playlist-dto.interface';
import { LibraryPlaylistTrack } from './playlist-model.interface';

export function mapPlaylistResponseToLibraryPlaylist(dto: PlaylistResponseDto) {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description || '',
    createdAt: dto.createdAt,
    tracks: dto.tracks.map(
      (t): LibraryPlaylistTrack => ({
        ...t.track,

        origin: t.origin,
        order: t.order,
      }),
    ),
  };
}
