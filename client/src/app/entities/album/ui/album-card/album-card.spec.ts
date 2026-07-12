import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumCard } from './album-card';
import { provideRouter } from '@angular/router';

describe('AlbumCard', () => {
  const mockAlbum = { id: '1', name: 'Viktor', image: 'img', releasedate: '12' };
  let component: AlbumCard;
  let fixture: ComponentFixture<AlbumCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('album', mockAlbum);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('is link', () => {
    fixture.componentRef.setInput('isLink', true);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a');
    expect(link).toBeTruthy();
  });
  it('is article', () => {
    fixture.componentRef.setInput('isLink', false);
    fixture.detectChanges();
    const article = fixture.nativeElement.querySelector('article');
    expect(article).toBeTruthy();
  });
  it('should display album data', () => {
    const title = fixture.nativeElement.querySelector('.album__title');
    expect(title.textContent).toContain(mockAlbum.name);
    const date = fixture.nativeElement.querySelector('.album__releasedate');
    expect(date.textContent).toContain(mockAlbum.releasedate);
  });
});
