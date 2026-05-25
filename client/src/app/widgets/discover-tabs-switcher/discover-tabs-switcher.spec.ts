import { ComponentFixture, TestBed } from '@angular/core/testing';

import DiscoverTabsSwitcher from './discover-tabs-switcher';
import { TracksStore } from '../../entities/track/model/track.store';
import { TRACK_DATA_PROVIDER } from '../tracks-list/model/track-provider.token';

describe('DiscoverTabsSwitcher', () => {
  let component: DiscoverTabsSwitcher;
  let fixture: ComponentFixture<DiscoverTabsSwitcher>;

  const mockTracksStore = {
    setListTitle: vi.fn(),
    loadTracks: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoverTabsSwitcher],
      providers: [
        { provide: TracksStore, useValue: mockTracksStore },
        {
          provide: TRACK_DATA_PROVIDER,
          useValue: {
            tracks: () => [],
            isLoading: () => false,
            error: () => null,
            listTitle: () => 'Popular Tracks',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverTabsSwitcher);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('order', 'popularity_total');
    fixture.componentRef.setInput('pageTitle', 'Popular Tracks');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger store loading on changes', () => {
    expect(mockTracksStore.loadTracks).toHaveBeenCalledWith({
      order: 'popularity_total',
      limit: 30,
    });
  });
});
