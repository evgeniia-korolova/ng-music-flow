import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTracks } from './custom-tracks';

describe('CustomTracks', () => {
  let component: CustomTracks;
  let fixture: ComponentFixture<CustomTracks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTracks],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomTracks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
