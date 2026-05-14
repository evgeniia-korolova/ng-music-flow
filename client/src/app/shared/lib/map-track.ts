import { Track, TrackDto } from '../../entities/track/model/track.model';
import { generateFakePeaks } from './waveform';

export function mapTrack(dto: TrackDto): Track {
  return {
    id: dto.id,
    name: dto.name,
    duration: dto.duration,
    artistName: dto.artist_name,
    albumName: dto.album_name,
    image: dto.image,
    audio: dto.audio,
    waveform: generateFakePeaks(dto.duration ? Math.floor(dto.duration / 2) : 60),
  };
}
