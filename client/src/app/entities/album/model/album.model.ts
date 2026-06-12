import { Track, TrackDto } from '../../track/model/track.model';

export interface Album {
  id: string;
  name: string;
  releasedate: string;
  image: string;
}

export interface ArtistAlbumsResponseDTO {
  id: string;
  name: string;
  website: string;
  joindate: string;
  image: string;
  albums: Album[];
}
export interface AlbumDetailsDto extends Album {
  artist_name: string;
  tracks: TrackDto[];
}
export interface AlbumWithTracks extends Album {
  tracks: Track[];
}
