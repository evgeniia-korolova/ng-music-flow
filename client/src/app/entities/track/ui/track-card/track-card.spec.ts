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
    artist_id: '101',
    artist_name: 'Test Artist',
    album_id: '201',
    album_name: 'Test Album',
    image: 'test-image.jpg',
    audio: 'test-audio.mp3',
    audiodownload: 'test-download.mp3',
    stats: {
      rate_total: 5,
      playcount_total: 1000,
    },
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
