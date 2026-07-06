export interface Track {
  id: string;
  title: string;
  duration: number;
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
  genre?: string;
  userId?: string;
}
