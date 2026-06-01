import { afterNextRender, Directive, inject } from '@angular/core';
import { Input } from '../../entities/track/ui/input/input';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective {
  private readonly inputComponent = inject(Input, { host: true });

  constructor() {
    afterNextRender(() => {
      const childRef = this.inputComponent.inputElement();

      childRef?.nativeElement.focus();
    });
  }
}
