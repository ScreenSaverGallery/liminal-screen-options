import { Component, input } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';
// icons
import { LucideDynamicIcon, LucideMinus as Minus, LucidePlus as Plus } from '@lucide/angular';
// radix
import { RdxLabelDirective } from '@radix-ng/primitives/label';
import {
    RdxNumberFieldDecrement,
    RdxNumberFieldGroup,
    RdxNumberFieldIncrement,
    RdxNumberFieldInput,
    RdxNumberFieldRoot
} from '@radix-ng/primitives/number-field';

@Component({
  selector: 'app-number-field',
  imports: [
    LucideDynamicIcon,
    RdxLabelDirective,
    RdxNumberFieldRoot,
    RdxNumberFieldGroup,
    RdxNumberFieldInput,
    RdxNumberFieldIncrement,
    RdxNumberFieldDecrement,
    FormField
  ],
  templateUrl: './number-field.html',
  styleUrl: './number-field.scss',
})
export class NumberField {
  formField = input.required<Field<number | null>>();
  fieldId = input.required<string>();
  protected readonly format: Intl.NumberFormatOptions = {
      signDisplay: 'exceptZero',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
  };

  protected readonly Minus = Minus;
  protected readonly Plus = Plus;
}
