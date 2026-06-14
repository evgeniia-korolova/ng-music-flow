import { Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(click)': 'hide()', // Скрываем при клике, чтобы тултип не висел после нажатия
  },
})
export class TooltipDirective {
  readonly tooltipText = input.required<string>({ alias: 'appTooltip' });

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private tooltipEl: HTMLElement | null = null;

  show(): void {
    if (!this.tooltipText()) return;

    this.tooltipEl = this.renderer.createElement('div');
    this.renderer.setAttribute(this.tooltipEl, 'popover', 'manual');
    this.renderer.addClass(this.tooltipEl, 'global-tooltip');

    const textNode = this.renderer.createText(this.tooltipText());
    this.renderer.appendChild(this.tooltipEl, textNode);

    this.renderer.appendChild(document.body, this.tooltipEl);

    this.updatePosition();

    if (typeof this.tooltipEl?.showPopover === 'function') {
      this.tooltipEl.showPopover();
    }
  }

  hide(): void {
    if (this.tooltipEl) {
      if (typeof this.tooltipEl.hidePopover === 'function') {
        this.tooltipEl.hidePopover();
      }
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
  }

  private updatePosition(): void {
    if (!this.tooltipEl) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();

    this.tooltipEl.style.display = 'block';
    const tooltipRect = this.tooltipEl.getBoundingClientRect();

    const top = hostRect.top - tooltipRect.height - 8 + window.scrollY;
    const left = hostRect.left + (hostRect.width - tooltipRect.width) / 2 + window.scrollX;

    this.renderer.setStyle(this.tooltipEl, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipEl, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipEl, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipEl, 'margin', '0');
    this.renderer.setStyle(this.tooltipEl, 'z-index', '2000');
  }
}
