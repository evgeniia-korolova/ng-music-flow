import { ComponentFixture, TestBed } from '@angular/core/testing';
import Discover from './discover';
import { provideRouter } from '@angular/router';

describe('Discover', () => {
  let component: Discover;
  let fixture: ComponentFixture<Discover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Discover],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Discover);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
