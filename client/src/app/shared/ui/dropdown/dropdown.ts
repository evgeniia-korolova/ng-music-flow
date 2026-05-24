import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  contentChild,
  contentChildren,
  DOCUMENT,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
  signal,
  TemplateRef,
} from '@angular/core';
import { Icon } from '../icon/icon.component';

@Component({
  selector: 'app-dropdown',
  imports: [NgTemplateOutlet, Icon],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  exportAs: 'dropdownRef',
})
export class Dropdown {
  isOpen = signal(false);
  private readonly el = inject(ElementRef);
  alignment = input<'left' | 'right'>('left');

  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect((onCleanup) => {
      const el = this.triggerButton()?.nativeElement;
      const body = this.document.body;

      if (!el) return;

      if (this.isOpen()) {
        el.dataset['active'] = 'true';
        this.renderer.addClass(body, 'overflow-hidden');
      } else {
        delete el.dataset['active'];
        this.renderer.removeClass(body, 'overflow-hidden');
      }

      onCleanup(() => {
        this.renderer.removeClass(body, 'overflow-hidden');
      });
    });
  }

  triggerButton = contentChild('trigger', { read: ElementRef });
  dropdownItems = contentChildren<TemplateRef<unknown>>('item');

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const triggerEl = this.triggerButton()?.nativeElement;

    const clickedTrigger =
      triggerEl && (triggerEl === clickedElement || triggerEl.contains(clickedElement));
    const clickedInsideDropdown = this.el.nativeElement.contains(clickedElement);

    if (clickedTrigger) {
      this.isOpen.update((prev) => !prev);
      return;
    }

    if (!clickedInsideDropdown) {
      this.isOpen.update(() => false);
    }
  }
}
