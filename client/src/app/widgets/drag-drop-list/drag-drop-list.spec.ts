import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropList } from './drag-drop-list';

import { ResponsiveService } from '../../shared/services/responsive-service/responsive-service';
import { LibraryPlaylistTrack } from '../../entities/track/model/track.model';

const mockTracks: LibraryPlaylistTrack[] = [
  {
    id: '1',
    title: 'First Track',
    duration: 180,
    origin: 'JAMENDO',
    artist: { id: '1', name: 'Artist 1' },
    album: { id: '1', name: 'Album 1' },
    coverUrl: 'images/track-placeholder.jpg',
    audioUrl: 'http://example.com',
    playCount: 100,
    rating: 5,
    waveform: [0.2, 0.4, 0.6, 0.3, 0.5, 0.1, 0.7, 0.4, 0.2, 0.5],
    releasedate: '2026-03-30',
  } as LibraryPlaylistTrack,
  {
    id: '2',
    title: 'Second Track',
    duration: 210,
    origin: 'JAMENDO',
    artist: { id: '2', name: 'Artist 2' },
    album: { id: '2', name: 'Album 2' },
    coverUrl: 'images/track-placeholder.jpg',
    audioUrl: 'http://example.com',
    playCount: 200,
    rating: 4,
    waveform: [0.1, 0.5, 0.3, 0.6, 0.2, 0.7, 0.4, 0.3, 0.6, 0.2],
    releasedate: '2026-03-30',
  } as LibraryPlaylistTrack,
];

describe('DragDropList', () => {
  let component: DragDropList;
  let fixture: ComponentFixture<DragDropList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragDropList],
      providers: [{ provide: ResponsiveService, useValue: { isLarge: () => true } }],
    }).compileComponents();

    fixture = TestBed.createComponent(DragDropList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tracks', mockTracks);
    fixture.detectChanges();
  });

  it('should initialize tracks correctly', () => {
    expect(component.currentTracks()).toEqual(mockTracks);
    expect(component.isOrderChanged()).toBe(false);
  });

  it('should change order status when tracks are moved', () => {
    component.currentTracks.set([
      { id: '2' } as LibraryPlaylistTrack,
      { id: '1' } as LibraryPlaylistTrack,
    ]);
    expect(component.isOrderChanged()).toBe(true);
  });
});
