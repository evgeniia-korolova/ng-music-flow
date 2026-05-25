export interface Genre {
  readonly id: string;
  readonly title: string;
  readonly image: string;
}
export const GENRES_DATA: readonly Genre[] = [
  {
    id: 'pop',
    title: 'Pop',
    image: '/genres/pop.webp',
  },
  {
    id: 'rock',
    title: 'Rock',
    image: '/genres/rock.webp',
  },
  {
    id: 'electronic',
    title: 'Electronic',
    image: '/genres/electronic.webp',
  },
  {
    id: 'hiphop',
    title: 'Hip-Hop',
    image: '/genres/hiphop.webp',
  },
  {
    id: 'jazz',
    title: 'Jazz',
    image: '/genres/jazz.webp',
  },
  {
    id: 'classic',
    title: 'Classical',
    image: '/genres/classical.webp',
  },
  {
    id: 'chillout',
    title: 'Lounge',
    image: '/genres/lounge.webp',
  },
  {
    id: 'relaxation',
    title: 'Relaxation',
    image: '/genres/relaxation.webp',
  },
  {
    id: 'songwriter',
    title: 'Songwriter',
    image: '/genres/songwriter.webp',
  },
  {
    id: 'world',
    title: 'World',
    image: '/genres/world.webp',
  },
  {
    id: 'metal',
    title: 'Metal',
    image: '/genres/metal.webp',
  },
  {
    id: 'soundtrack',
    title: 'Soundtrack',
    image: '/genres/soundtrack.webp',
  },
] as const;
