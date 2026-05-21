import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackCard } from './track-card';
import { Track } from '../../model/track.model';

describe('TrackCard', () => {
  let component: TrackCard;
  let fixture: ComponentFixture<TrackCard>;

  const mockTrack: Track = {
    id: '1',
    title: 'Test Track',
    duration: 180,
    artist: {
      id: '555',
      name: 'Test Name',
    },
    album: {
      id: '122',
      name: 'Test Album',
    },
    coverUrl: 'test-image.jpg',
    audioUrl: 'test-audio.mp3',
    playCount: 10,
    rating: 50,
    waveform: [2, 5, 4],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('track', mockTrack);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
