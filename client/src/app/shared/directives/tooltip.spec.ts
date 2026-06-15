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

    // Находим кнопку, на которой висит директива
    const buttonDebug = fixture.debugElement.query(By.css('button'));
    buttonEl = buttonDebug.nativeElement;

    fixture.detectChanges(); // Первая инициализация
  });

  // Чистим DOM после каждого теста, так как директива рендерит поповер в body
  afterEach(() => {
    const remainingTooltips = document.querySelectorAll('.global-tooltip');
    remainingTooltips.forEach((el) => el.remove());
  });

  it('should create host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should create and show tooltip element on mouseenter', () => {
    // Имитируем наведение мыши на кнопку (mouseenter)
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    // Ищем созданный поповер в документе (document.body)
    const tooltipEl = document.querySelector('.global-tooltip');

    expect(tooltipEl).toBeTruthy();
    expect(tooltipEl?.textContent).toBe('Initial Tooltip');
    expect(tooltipEl?.getAttribute('popover')).toBe('manual');
  });

  it('should remove tooltip element on mouseleave', () => {
    // Сначала наводим, чтобы он создался
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(document.querySelector('.global-tooltip')).toBeTruthy();

    // Теперь убираем мышь (mouseleave)
    buttonEl.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    // Проверяем, что элемент полностью удалился из DOM
    expect(document.querySelector('.global-tooltip')).toBeNull();
  });

  it('should hide and remove tooltip on click', () => {
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    // Кликаем по кнопке (click)
    buttonEl.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    // Проверяем, что тултип скрылся при клике (наше требование для шторки)
    expect(document.querySelector('.global-tooltip')).toBeNull();
  });

  it('should dynamically update text when input signal changes', () => {
    // Наводим
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(document.querySelector('.global-tooltip')?.textContent).toBe('Initial Tooltip');

    // Убираем мышь, чтобы сбросить стейт
    buttonEl.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    // ВАЖНО: Меняем значение сигнала в хост-компоненте
    hostComponent.tooltipText.set('Updated Tooltip text');
    fixture.detectChanges();

    // Наводим снова и проверяем реактивность инпута
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(document.querySelector('.global-tooltip')?.textContent).toBe('Updated Tooltip text');
  });
});
