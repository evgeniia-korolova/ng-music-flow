import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.html',
})
export class FormError {
  readonly control = input<AbstractControl | null>();
}
