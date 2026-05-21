import { Track, TrackDto } from '../../entities/track/model/track.model';

export function mapTrack(dto: TrackDto): Track {
  let realPeaks: number[] = [];

  try {
    if (dto.waveform && typeof dto.waveform === 'string') {
      const parsedWaveform = JSON.parse(dto.waveform);
      if (parsedWaveform && Array.isArray(parsedWaveform.peaks)) {
        realPeaks = parsedWaveform.peaks.map((peak: number) => peak / 100);
      }
    }
  } catch (e) {
    console.warn('Fail to parse real waveform:', dto.name, e);
  }

  if (realPeaks.length === 0) {
    realPeaks = Array.from({ length: 40 }, () => Math.random() * 0.6 + 0.2);
  }

  return {
    id: dto.id,
    title: dto.name,
    duration: dto.duration,
    artist: {
      name: dto.artist_name,
      id: dto.artist_id,
    },
    album: {
      id: dto.album_id,
      name: dto.album_name,
    },
    coverUrl: dto.album_image || 'images/track-placeholder.jpg',
    audioUrl: dto.audio,
    playCount: dto.stats?.playcount_total || 0,
    rating: dto.stats?.rate_total || 0,
    waveform: realPeaks,
  };
}
