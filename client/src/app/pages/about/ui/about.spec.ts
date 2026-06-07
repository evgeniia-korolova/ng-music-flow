import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { About } from '../ui/about';

describe('About', () => {
  let component: About;
  let fixture: ComponentFixture<About>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [About],
    }).compileComponents();

    fixture = TestBed.createComponent(About);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render correct number of team cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('.card-team'));
    expect(cards.length).toBe(component.teamMembers.length);
  });
  it('should display correct name in the first card', () => {
    const name = fixture.debugElement.query(By.css('.card-team__name'));
    const currentName = name.nativeElement.textContent.trim();
    expect(currentName).toBe(component.teamMembers[0].name);
  });
  it('should contain secure attributes for external links', () => {
    const link = fixture.debugElement.query(By.css('.team__rs-logo'));
    expect(link.attributes['target']).toBe('_blank');
    expect(link.attributes['rel']).toBe('noopener noreferrer');
  });
});
