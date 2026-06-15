import { afterNextRender, Directive, ElementRef, inject, input } from '@angular/core';
import { Input } from '../forms/input/input';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective {
  private readonly inputComponent = inject(Input, {
    host: true,
    optional: true,
  });

  readonly appAutofocus = input<boolean | ''>(true);

  private readonly hostElement = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      const shouldFocus = this.appAutofocus() !== false;
      if (!shouldFocus) return;

      if (this.inputComponent) {
        const childRef = this.inputComponent.inputElement();

        childRef?.nativeElement.focus();
      } else {
        this.hostElement.nativeElement.focus();
      }
    });
  }
}
