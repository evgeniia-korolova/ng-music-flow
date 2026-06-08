import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';
import { Input } from '../forms/input/input';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective {
  // private readonly inputComponent = inject(Input, { host: true });
  private readonly inputComponent = inject(Input, {
    host: true,
    optional: true,
  });

  private hostElement = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      if (this.inputComponent) {
        const childRef = this.inputComponent.inputElement();

        childRef?.nativeElement.focus();
      } else {
        this.hostElement.nativeElement.focus();
      }
    });
  }
}
