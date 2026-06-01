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
});
