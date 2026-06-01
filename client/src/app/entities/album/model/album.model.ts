export interface Album {
  id: string;
  name: string;
  releasedate: string;
  image: string;
}

export interface ArtistAlbumsResponseDTO {
  id: string;
  name: string;
  website: string;
  joindate: string;
  image: string;
  albums: Album[];
}
