import { Component, signal } from '@angular/core';
import { TooltipDirective } from './tooltip';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [TooltipDirective],
  template: ` <button [appTooltip]="tooltipText()">Hover me</button> `,
})
class TestHostComponent {
  readonly tooltipText = signal<string>('Initial Tooltip');
}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let buttonEl: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TooltipDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;

    const buttonDebug = fixture.debugElement.query(By.css('button'));
    buttonEl = buttonDebug.nativeElement;

    fixture.detectChanges(); // Первая инициализация
  });

  afterEach(() => {
    const remainingTooltips = document.querySelectorAll('.global-tooltip');
    remainingTooltips.forEach((el) => el.remove());
  });

  it('should create host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should create and show tooltip element on mouseenter', () => {
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const tooltipEl = document.querySelector('.global-tooltip');

    expect(tooltipEl).toBeTruthy();
    expect(tooltipEl?.textContent).toBe('Initial Tooltip');
    expect(tooltipEl?.getAttribute('popover')).toBe('manual');
  });

  it('should remove tooltip element on mouseleave', () => {
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(document.querySelector('.global-tooltip')).toBeTruthy();

    buttonEl.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    expect(document.querySelector('.global-tooltip')).toBeNull();
  });

  it('should hide and remove tooltip on click', () => {
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    buttonEl.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(document.querySelector('.global-tooltip')).toBeNull();
  });

  it('should dynamically update text when input signal changes', () => {
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(document.querySelector('.global-tooltip')?.textContent).toBe('Initial Tooltip');

    buttonEl.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    hostComponent.tooltipText.set('Updated Tooltip text');
    fixture.detectChanges();

    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(document.querySelector('.global-tooltip')?.textContent).toBe('Updated Tooltip text');
  });
});
