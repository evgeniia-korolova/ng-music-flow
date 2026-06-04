import { SearchSortOrder } from '../../../pages/search-page/model/search.model';
import { normalize } from './normalize-track';
import { Track } from './track.model';

export function getTrackSortValue(track: Track, sortBy: SearchSortOrder) {
  switch (sortBy) {
    case 'title':
      return normalize(track.title);

    case 'artist':
      return normalize(track.artist?.name ?? '');

    case 'popularity':
      return track.playCount ?? 0;

    case 'date':
      return track.releasedate ?? '';

    default:
      return '';
  }
}

export function sortTracks(tracks: Track[], sortBy: SearchSortOrder, isAsc: boolean): Track[] {
  return [...tracks].sort((a, b) => {
    const A = getTrackSortValue(a, sortBy);
    const B = getTrackSortValue(b, sortBy);

    if (typeof A === 'string' && typeof B === 'string') {
      const comp = A.localeCompare(B, undefined, {
        sensitivity: 'base',
        numeric: true,
      });

      return isAsc ? comp : -comp;
    }

    return isAsc ? Number(A) - Number(B) : Number(B) - Number(A);
  });
}
