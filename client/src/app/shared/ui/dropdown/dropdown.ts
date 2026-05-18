import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  contentChild,
  contentChildren,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  TemplateRef,
} from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-dropdown',
  imports: [NgTemplateOutlet, LucideDynamicIcon],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  isOpen = signal(false);
  private readonly el = inject(ElementRef);
  alignment = input<'left' | 'right'>('left');

  constructor() {
    effect(() => {
      const el = this.triggerButton()?.nativeElement;

      if (!el) return;

      if (this.isOpen()) {
        el.dataset['active'] = 'true';
      } else {
        delete el.dataset['active'];
      }
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
