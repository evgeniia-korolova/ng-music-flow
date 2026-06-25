import { JamendoTrackDto } from 'src/library/DTOs/track.dto';
import { Track } from 'src/library/models/track.model';

export const mapJamendoToTrack = (dto: JamendoTrackDto): Track => {
  return {
    id: dto.id,
    title: dto.name,
    duration: dto.duration,
    artist: {
      id: dto.artist_id,
      name: dto.artist_name,
    },
    album: {
      id: dto.album_id,
      name: dto.album_name,
    },
    coverUrl: dto.album_image,
    audioUrl: dto.audio,
    playCount: dto.stats.rate_listened_total,
    rating: dto.stats.rate_total,
    waveform: dto.waveform ? dto.waveform.split(',').map(Number) : [],
    releasedate: dto.releasedate,
  };
};
