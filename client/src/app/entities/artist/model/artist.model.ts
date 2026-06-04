import { TrackDto } from '../../track/model/track.model';

export interface ArtistDto {
  id: string;
  name: string;
  website: string;
  joindate: string;
  image: string;
  shorturl: string;
  shareurl: string;
}

export interface Artist {
  id: string;
  name: string;
  website: string;
  joinDate: string;
  image: string;
  shortUrl: string;
  shareUrl: string;
}
export interface ArtistTracksResponseDTO {
  id: string;
  name: string;
  tracks: TrackDto[];
}
