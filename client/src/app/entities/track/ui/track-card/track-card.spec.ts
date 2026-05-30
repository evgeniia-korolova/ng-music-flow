import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackCard } from './track-card';
import { Track } from '../../model/track.model';
import { provideRouter, RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('TrackCard', () => {
  let component: TrackCard;
  let fixture: ComponentFixture<TrackCard>;

  const mockTrack: Track = {
    id: '1',
    title: 'Test Track',
    duration: 180,
    artist: {
      id: '555',
      name: 'Test Artist',
    },
    album: {
      id: '122',
      name: 'Test Album',
    },
    coverUrl: 'test-image.jpg',
    audioUrl: 'test-audio.mp3',
    playCount: 1000000,
    rating: 50,
    waveform: [2, 5, 4],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('track', mockTrack);
    fixture.componentRef.setInput('showWave', true);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should render track title and artist name', () => {
    const titleEl = fixture.debugElement.query(By.css('.track-card__title')).nativeElement;
    const metaEl = fixture.debugElement.query(By.css('.track-card__meta')).nativeElement;

    expect(titleEl.textContent).toContain('Test Track');
    expect(metaEl.textContent).toContain('Test Artist');
  });

  it('it should specify correct links routerLink for artist and album', () => {
    const linkElements = fixture.debugElement
      .query(By.css('.track-card__info'))
      .queryAll(By.directive(RouterLink));

    const artistLinkInstance = linkElements[0].injector.get(RouterLink);
    expect(artistLinkInstance.urlTree?.toString()).toBe('/artists/555');

    const albumLinkInstance = linkElements[1].injector.get(RouterLink);
    expect(albumLinkInstance.urlTree?.toString()).toBe('/albums/122');
  });

  it('should render waveform container when showWave is true', () => {
    fixture.componentRef.setInput('showWave', true);
    fixture.detectChanges();

    const waveformContainer = fixture.debugElement.query(
      By.css('[data-testid="waveform-container"]'),
    );
    expect(waveformContainer).toBeTruthy();
  });

  it('should NOT render waveform container when showWave is false', async () => {
    fixture.componentRef.setInput('showWave', false);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const waveformContainer = fixture.debugElement.query(
      By.css('[data-testid="waveform-container"]'),
    );

    expect(waveformContainer).toBeNull();
  });
});
