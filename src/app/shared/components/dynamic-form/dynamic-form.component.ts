import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IField } from '../../../core/interfaces/field.interface';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent<T extends Record<string, any> = any>
  implements OnInit
{
  @Input() fields: IField<Extract<keyof T, string>>[] = [];

  @Input() messageError: string = '';

  /** optional: dùng cho update form */
  @Input() initialValue: Partial<T> = {};

  @Output() formSubmit = new EventEmitter<T>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['initialValue'] &&
      !changes['initialValue'].firstChange &&
      this.form &&
      this.initialValue
    ) {
      this.form.patchValue(this.initialValue);
    }
  }

  ngOnInit(): void {
    const group: Record<string, any> = {};

    this.fields.forEach((field) => {
      const validators = field.required ? [Validators.required] : [];

      let defaultValue =
        this.initialValue[field.name as keyof T] ?? field.default;

      if (defaultValue === undefined) {
        if (field.type === 'checkbox' && typeof field.default === 'boolean') {
          defaultValue = field.default;
        } else {
          switch (field.type) {
            case 'checkbox':
              defaultValue = false;
              break;
            case 'select':
              defaultValue = null;
              break;
            default:
              defaultValue = '';
          }
        }
      }

      // ✅ Đây là chỗ cực kỳ quan trọng
      group[field.name] = this.fb.control(defaultValue, validators);
    });

    this.form = this.fb.group(group);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value as T);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
