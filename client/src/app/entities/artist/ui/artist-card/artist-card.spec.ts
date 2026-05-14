import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistCard } from './artist-card';
import { provideRouter } from '@angular/router';

describe('ArtistCard', () => {
  let component: ArtistCard;
  let fixture: ComponentFixture<ArtistCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('artist', { id: '1', name: 'Test Artist' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
