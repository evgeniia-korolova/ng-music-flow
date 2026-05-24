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

  triggerButton = contentChild<ElementRef<HTMLElement>>('trigger');
  dropdownItems = contentChildren<TemplateRef<unknown>>('item');

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const triggerEl = this.triggerButton()?.nativeElement;

    const clickedInsideDropdown = this.el.nativeElement.contains(clickedElement);

    if (triggerEl === clickedElement || triggerEl?.contains(clickedElement)) {
      this.isOpen.update((prev) => !prev);
      return;
    }

    if (!clickedInsideDropdown) {
      this.isOpen.update(() => false);
    }
  }
}
