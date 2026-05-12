import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracksList } from './tracks-list';

describe('TracksList', () => {
  let component: TracksList;
  let fixture: ComponentFixture<TracksList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracksList],
    }).compileComponents();

    fixture = TestBed.createComponent(TracksList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
