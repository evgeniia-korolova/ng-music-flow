import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenreCard } from './genre-card';
import { provideRouter } from '@angular/router';

describe('GenreCard', () => {
  let component: GenreCard;
  let fixture: ComponentFixture<GenreCard>;
  const mockGenre = { id: 'test', title: 'title', image: '/genres/pop.webp' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreCard],
      providers: [provideRouter([])],
    }).compileComponents();

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
  it('should bind correct image src and alt attributes', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toEqual(mockGenre.image);

    expect(img.getAttribute('alt')).toEqual(mockGenre.title);
  });
  it('should call onGenreClick on link click', () => {
    vi.spyOn(component, 'onGenreClick').mockImplementation(() => undefined);
    const link = fixture.nativeElement.querySelector('a');
    link.click();
    expect(component.onGenreClick).toHaveBeenCalledWith(mockGenre.id);
  });
  it('should prevent default and call onGenreClick on space keydown', () => {
    vi.spyOn(component, 'onGenreClick').mockImplementation(() => undefined);
    const event = new KeyboardEvent('keydown', { key: ' ' });
    vi.spyOn(event, 'preventDefault');
    const link = fixture.nativeElement.querySelector('a');
    link.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.onGenreClick).toHaveBeenCalledWith(mockGenre.id);
  });
});
