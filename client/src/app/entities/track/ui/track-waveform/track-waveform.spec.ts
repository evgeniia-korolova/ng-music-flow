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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
