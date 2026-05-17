import { Artist, ArtistDto } from '../../entities/artist/model/artist.model';

export function mapArtist(dto: ArtistDto): Artist {
  return {
    id: dto.id,
    name: dto.name,
    website: dto.website,
    joinDate: dto.joindate,
    image: dto.image,
    shortUrl: dto.shorturl,
    shareUrl: dto.shareurl,
  };
}
