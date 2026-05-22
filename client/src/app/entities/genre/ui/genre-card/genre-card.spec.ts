import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreCard } from './genre-card';
import { provideRouter } from '@angular/router';

describe('GenreCard', () => {
  let component: GenreCard;
  let fixture: ComponentFixture<GenreCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreCard],
      providers: [provideRouter([])],
    }).compileComponents();

    const mockGenre = { id: 'test', title: 'title', img: '/genres/pop.webp' };
    fixture = TestBed.createComponent(GenreCard);
    fixture.componentRef.setInput('genre', mockGenre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display genre title in h3', () => {
    const h3Comp = fixture.nativeElement.querySelector('h3');
    expect(h3Comp.textContent).toContain('title');
  });
});
