import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackWaveform } from './track-waveform';

describe('TrackWaveform', () => {
  let component: TrackWaveform;
  let fixture: ComponentFixture<TrackWaveform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackWaveform],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackWaveform);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('peaks', [0.2, 0.5, 0.8, 0.4, 0.7]);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render canvas', () => {
    const canvas = fixture.nativeElement.querySelector('canvas');

    expect(canvas).toBeTruthy();
  });
});
