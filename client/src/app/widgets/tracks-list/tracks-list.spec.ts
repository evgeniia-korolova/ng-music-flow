import { ComponentFixture, DeferBlockState, TestBed } from '@angular/core/testing';

import TracksList from './tracks-list';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Track } from '../../entities/track/model/track.model';
import { TRACK_DATA_PROVIDER, TrackDataProvider } from './model/track-provider.token';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ResponsiveService } from '../../shared/services/responsive-service/responsive-service';

describe('TracksList', () => {
  let component: TracksList;
  let fixture: ComponentFixture<TracksList>;

  const tracksSignal = signal<Track[]>([]);
  const isLoadingSignal = signal<boolean>(false);
  const errorSignal = signal<string | null>(null);
  const listTitleSignal = signal<string>('Test Title');

  const mockDataProvider: TrackDataProvider = {
    tracks: tracksSignal,
    isLoading: isLoadingSignal,
    error: errorSignal,
    listTitle: listTitleSignal,
  };

  const mockTrack: Track = {
    id: '1',
    title: 'Test Track',
    duration: 180,
    artist: { id: '555', name: 'Test Name' },
    album: { id: '122', name: 'Test Album' },
    coverUrl: 'test-image.jpg',
    audioUrl: 'test-audio.mp3',
    playCount: 10,
    rating: 50,
    waveform: [2, 5, 4],
  };

  const mockIsLarge = signal(true);
  const mockIsMedium = signal(false);
  const mockIsMdTailwind = signal(false);

  beforeEach(async () => {
    tracksSignal.set([]);
    isLoadingSignal.set(false);
    errorSignal.set(null);
    mockIsLarge.set(true);
    mockIsMedium.set(false);

    await TestBed.configureTestingModule({
      imports: [TracksList],
      providers: [
        { provide: TRACK_DATA_PROVIDER, useValue: mockDataProvider },
        provideRouter([]),
        {
          provide: ResponsiveService,
          useValue: {
            isLarge: mockIsLarge,
            isMedium: mockIsMedium,
            isMdTailwind: mockIsMdTailwind,
            isSmall: signal(false),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TracksList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('viewMode', 'tabs');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display dynamic title from provider', () => {
    const titleEl = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(titleEl.textContent).toContain('Test Title');
  });

  it('should show loader when isLoading is true', async () => {
    isLoadingSignal.set(true);
    fixture.detectChanges();

    await fixture.whenStable();

    const loaderEl = fixture.debugElement.query(By.css('.text-accent'));
    expect(loaderEl).toBeTruthy();
    expect(loaderEl.nativeElement.textContent).toContain('Loading tracks...');
  });

  it('should display error message when error occurs', async () => {
    errorSignal.set('API Error occurred');
    fixture.detectChanges();

    await fixture.whenStable();

    const errorEl = fixture.debugElement.query(By.css('.text-red-500'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain('API Error occurred');
  });

  it('should render tracks list when data is loaded', async () => {
    tracksSignal.set([mockTrack]);
    fixture.detectChanges();

    const deferBlocks = await fixture.getDeferBlocks();

    await deferBlocks[0].render(DeferBlockState.Complete);

    fixture.detectChanges();
    await fixture.whenStable();

    const itemEl = fixture.debugElement.query(By.css('li'));
    expect(itemEl).toBeTruthy();
  });

  describe('Adaptive showWave logic (linkedSignal)', () => {
    ['tabs', 'search'].forEach((mode) => {
      it(`should show wave on Large and MdTailwind screens in ${mode} mode`, () => {
        fixture.componentRef.setInput('viewMode', mode as 'tabs' | 'search');

        mockIsLarge.set(true);
        mockIsMdTailwind.set(false);
        fixture.detectChanges();
        expect(component.showWave()).toBe(true);

        mockIsLarge.set(false);
        mockIsMdTailwind.set(true);
        fixture.detectChanges();
        expect(component.showWave()).toBe(true);

        mockIsLarge.set(false);
        mockIsMdTailwind.set(false);
        fixture.detectChanges();
        expect(component.showWave()).toBe(false);
      });
    });

    it('should NEVER show wave in slider mode', () => {
      fixture.componentRef.setInput('viewMode', 'slider');

      mockIsLarge.set(true);
      mockIsMdTailwind.set(true);
      fixture.detectChanges();
      expect(component.showWave()).toBe(false);
    });
  });
});
