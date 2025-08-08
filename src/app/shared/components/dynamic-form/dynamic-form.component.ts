import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IField } from '../../../core/interfaces/field.interface';
import { FormatMoneyDirective } from '../../directives/format-money.directive';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormatMoneyDirective],
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
      const validators = [];

      if (field.required) validators.push(Validators.required);
      if (field.money) validators.push(this.moneyValidator());

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
            case 'number':
            case 'date':
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

  // Validator kiểm tra số tiền hợp lệ (ví dụ: 1.000, 10.000, ...)
  moneyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const val = control.value;
      if (val === null || val === undefined || val.toString().trim() === '') {
        return { invalidMoney: true };
      }
      // Bắt lỗi nếu có ký tự không phải số
      const isValid = /^\d+$/.test(val.toString());
      return isValid ? null : { invalidMoney: true };
    };
  }
}
