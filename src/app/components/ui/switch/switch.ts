import { Component, input } from '@angular/core';
// radix
import { RdxLabelDirective } from '@radix-ng/primitives/label';
import { RdxSwitchRoot, RdxSwitchThumb } from '@radix-ng/primitives/switch';
// formfield
import { FormField, Field } from '@angular/forms/signals';
@Component({
  selector: 'app-switch',
  imports: [ FormField, RdxSwitchRoot, RdxSwitchThumb, RdxLabelDirective ],
  templateUrl: './switch.html',
  styleUrl: './switch.scss',
})
export class Switch {
  formField = input.required<Field<boolean>>();
  fieldId = input.required<string>();
  warning = input<boolean>(false);
}
