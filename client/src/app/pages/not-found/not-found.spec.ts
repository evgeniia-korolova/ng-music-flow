import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NotFound } from './not-found';

describe('NotFound', () => {
  let component: NotFound;
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display the correct title', () => {
    const title = fixture.debugElement.query(By.css('.not-found__title'));
    const currentTitle = title.nativeElement.textContent.trim();
    expect(currentTitle).toBe('Page not found');
  });
  it('should display the home button with correct text', () => {
    const btn = fixture.debugElement.query(By.css('app-button'));
    const currentBtn = btn.nativeElement.textContent.trim();
    expect(currentBtn).toBe('Go home');
  });
});
