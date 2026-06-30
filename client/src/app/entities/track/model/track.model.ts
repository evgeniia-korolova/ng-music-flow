export interface TrackDto {
  id: string;
  name: string;
  duration: number;
  artist_id: string;
  artist_name: string;
  album_name: string;
  album_id: string;
  album_image: string;
  audio: string;
  audiodownload: string;
  waveform: string;
  stats: {
    rate_total: number;
    rate_listened_total: number;
    rate_downloads_total: number;
    likes: number;
  };
  releasedate: string;
}

export interface Track {
  id: string;
  title: string;
  duration: number;
  origin?: string;
  artist: {
    id: string;
    name: string;
  };
  album: {
    id: string;
    name: string;
  };
  coverUrl: string;
  audioUrl: string;
  playCount: number;
  rating: number;
  waveform: number[];
  releasedate: string;
}

export interface LibraryPlaylistTrack extends Track {
  origin?: 'JAMENDO' | 'LOCAL';
  order?: number;
}
export interface CustomTrackTitle {
  id: string;
  title: string;
}
