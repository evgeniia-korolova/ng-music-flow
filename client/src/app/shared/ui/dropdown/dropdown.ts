import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  HostListener,
  inject,
  QueryList,
  signal,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [NgTemplateOutlet],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  isOpen = signal(false);
  private readonly el = inject(ElementRef);

  @ContentChild('trigger', { read: ElementRef }) triggerButton!: ElementRef<HTMLElement>;

  @ContentChildren('item') dropdownItems!: QueryList<TemplateRef<HTMLElement>>;

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const clickedElement = event.target as HTMLElement;

    if (this.triggerButton?.nativeElement.contains(clickedElement)) {
      this.isOpen.update((prev) => !prev);
      return;
    }

    if (!this.el.nativeElement.contains(clickedElement)) {
      this.isOpen.update(() => false);
    }
  }
}
