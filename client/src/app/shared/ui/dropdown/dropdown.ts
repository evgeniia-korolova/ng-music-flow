import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  contentChild,
  contentChildren,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
  signal,
  TemplateRef,
} from '@angular/core';
import { Icon } from '../icon/icon.component';
import { Button } from '../button/button';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  imports: [NgTemplateOutlet, Icon, Button],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  exportAs: 'dropdownRef',
})
export class Dropdown {
  private readonly el = inject(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);

  readonly expandable = input(true);
  readonly alignment = input<'left' | 'right'>('left');
  readonly blockScroll = input(false);

  readonly isOpen = signal(false);

  readonly triggerButton = contentChild('trigger', { read: ElementRef });
  readonly dropdownItems = contentChildren<TemplateRef<unknown>>('item');

  constructor() {
    effect((onCleanup) => {
      const trigger = this.triggerButton()?.nativeElement;
      const body = this.document.body;
      const open = this.isOpen();

      if (!trigger) return;

      if (open) {
        trigger.dataset['active'] = 'true';
        trigger.setAttribute('aria-expanded', 'true');
        if (this.blockScroll()) {
          this.renderer.addClass(body, 'overflow-hidden');
        }
      } else {
        delete trigger.dataset['active'];
        trigger.setAttribute('aria-expanded', 'false');
        this.renderer.removeClass(body, 'overflow-hidden');
      }

      onCleanup(() => {
        this.renderer.removeClass(body, 'overflow-hidden');
      });
    });

    effect((onCleanup) => {
      if (!this.isOpen()) return;

      const clickSub = fromEvent<MouseEvent>(this.document, 'click').subscribe((event) => {
        const target = event.target as HTMLElement;
        const clickedInside = this.el.nativeElement.contains(target);

        if (!clickedInside) {
          this.isOpen.set(false);
        }
      });

      const keySub = fromEvent<KeyboardEvent>(this.document, 'keydown').subscribe((event) => {
        if (event.key === 'Escape') {
          this.isOpen.set(false);
          this.triggerButton()?.nativeElement.focus();
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          this.navigateItems(event.key);
        }
      });

      onCleanup(() => {
        clickSub.unsubscribe();
        keySub.unsubscribe();
      });
    });
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen.update((prev) => !prev);

    // Если открыли, можно программно сфокусировать первый элемент (для этого пригодится твоя директива)
    // if (this.isOpen()) {
    //   setTimeout(() => this.focusFirstItem(), 0);
    // }
  }

  private focusFirstItem(): void {
    const listElement = this.el.nativeElement.querySelector('.dropdown-list');
    const firstInteractive = listElement?.querySelector('a, button') as HTMLElement;
    firstInteractive?.focus();
  }

  private navigateItems(key: 'ArrowDown' | 'ArrowUp'): void {
    const listElement = this.el.nativeElement.querySelector('.dropdown-list');
    if (!listElement) return;

    const focusable = Array.from(listElement.querySelectorAll('a, button')) as HTMLElement[];
    if (focusable.length === 0) return;

    const currentFocused = this.document.activeElement as HTMLElement;
    let index = focusable.indexOf(currentFocused);

    if (key === 'ArrowDown') {
      index = (index + 1) % focusable.length;
    } else {
      index = (index - 1 + focusable.length) % focusable.length;
    }

    focusable[index]?.focus();
  }
}
