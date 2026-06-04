import { BROKEN_TRACK_IDS } from './track.constants';
import { Track } from './track.model';

export function isValidRichTrack(track: Track): boolean {
  if (BROKEN_TRACK_IDS.includes(String(track.id))) {
    return false;
  }

  if (!track.waveform || track.waveform.length === 0) return false;
  // if (track.duration < 30) return false;

  const loudPeaks = track.waveform.filter((peak) => peak > 0.2).length;
  return loudPeaks >= 25;
}
