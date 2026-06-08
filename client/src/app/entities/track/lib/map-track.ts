import { Track, TrackDto } from '../model/track.model';

export function mapTrack(dto: TrackDto): Track {
  let realPeaks: number[] = [];

  function cleanText(value: string | undefined, fallback: string): string {
    const trimmed = value?.trim();

    if (!trimmed || !/[\p{L}\p{N}]/u.test(trimmed)) {
      return fallback;
    }

    return trimmed;
  }

  const cleanTitle = cleanText(dto.name, 'No Name');

  const cleanArtistName = cleanText(dto.artist_name, 'Unknown Artist');

  const cleanAlbumName = cleanText(dto.album_name, 'Unknown Album');

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
    title: cleanTitle,
    duration: dto.duration,
    artist: {
      name: cleanArtistName,
      id: dto.artist_id,
    },
    album: {
      id: dto.album_id,
      name: cleanAlbumName,
    },
    coverUrl: dto.album_image || 'images/track-placeholder.jpg',
    audioUrl: dto.audio,
    playCount: dto.stats?.rate_listened_total || 0,
    rating: dto.stats?.rate_total || 0,
    waveform: realPeaks,
    releasedate: dto.releasedate,
  };
}
