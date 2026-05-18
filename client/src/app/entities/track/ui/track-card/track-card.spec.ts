import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackCard } from './track-card';
import { Track } from '../../model/track.model';

describe('TrackCard', () => {
  let component: TrackCard;
  let fixture: ComponentFixture<TrackCard>;

  const mockTrack: Track = {
    id: '1',
    name: 'Test Track',
    duration: 180,
    artistName: 'Test Artist',
    albumName: 'Test Album',
    image: 'test-image.jpg',
    audio: 'test-audio.mp3',
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
