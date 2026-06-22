export interface TabItem {
  path: string;
  title: string;
  shortTitle?: string;
}

export const DISCOVER_TABS: TabItem[] = [
  { path: 'popular', title: 'Popular Tracks', shortTitle: 'Popular' },
  { path: 'new', title: 'New Releases', shortTitle: 'New' },
  { path: 'genres', title: 'Genres' },
];
