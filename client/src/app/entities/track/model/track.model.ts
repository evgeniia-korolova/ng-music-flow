export interface Track {
  id: string;
  name: string;
  duration: number;
  artist_id: string;
  artist_name: string;
  album_name: string;
  album_id: string;
  image: string;
  audio: string;
  audiodownload: string;
  stats: {
    rate_total: number;
    playcount_total: number;
  };
}
