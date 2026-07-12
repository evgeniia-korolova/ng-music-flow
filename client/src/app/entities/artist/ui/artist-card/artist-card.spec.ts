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
  it('should render as a link when isLink is true', () => {
    fixture.componentRef.setInput('isLink', true);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a');
    expect(link).toBeTruthy();
    const paragraph = fixture.nativeElement.querySelector('p');
    expect(paragraph).toBeTruthy();
  });
  it('should render as an article with links when isLink is false', () => {
    fixture.componentRef.setInput('isLink', false);
    fixture.detectChanges();

    const article = fixture.nativeElement.querySelector('article');
    expect(article).toBeTruthy();

    const mainLinkWrapper = fixture.nativeElement.querySelector('a.artist-card');
    expect(mainLinkWrapper).toBeNull();

    const conatctLink = fixture.nativeElement.querySelector('a');
    expect(conatctLink).toBeTruthy();

    expect(conatctLink.getAttribute('target')).toBe('_blank');
  });
  it('should display artist name in h3', () => {
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Test Artist');
  });
});
