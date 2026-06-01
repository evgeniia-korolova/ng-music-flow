import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Genres } from './genres';
import { provideRouter } from '@angular/router';

describe('Genres', () => {
  let component: Genres;
  let fixture: ComponentFixture<Genres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Genres],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Genres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
