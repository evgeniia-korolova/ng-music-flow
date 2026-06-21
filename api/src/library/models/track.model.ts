export interface LocalTrack {
  id: string;
  userId: string;
  title: string;
  artist: string;
  genre: string;
  audioUrl: string;
  duration: number;
  releasedate: string;
  waveform: number[];
}
