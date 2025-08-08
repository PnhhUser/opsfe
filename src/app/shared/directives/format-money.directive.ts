import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appFormatMoney]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormatMoneyDirective),
      multi: true,
    },
  ],
})
export class FormatMoneyDirective implements ControlValueAccessor {
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private isWriting = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    if (this.isWriting) return;

    // Lưu giá trị input nguyên bản
    const rawValue = value;

    // Loại bỏ tất cả ký tự không phải số
    const unformattedValue = rawValue.replace(/\D/g, '');

    // Format lại giá trị số nguyên
    const formattedValue = this.formatMoney(unformattedValue);

    this.isWriting = true;
    this.el.nativeElement.value = formattedValue;
    this.isWriting = false;

    // Gửi giá trị chỉ số nguyên về formControl
    this.onChange(unformattedValue);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
    // Có thể thêm logic nếu muốn format lại khi mất focus
    const value = this.el.nativeElement.value;
    if (value) {
      this.isWriting = true;
      this.el.nativeElement.value = this.formatMoney(value.replace(/\./g, ''));
      this.isWriting = false;
    }
  }

  @HostListener('focus')
  onFocus() {
    // Khi focus bỏ dấu chấm để người dùng nhập dễ hơn
    const value = this.el.nativeElement.value;
    if (value) {
      this.isWriting = true;
      this.el.nativeElement.value = value.replace(/\./g, '');
      this.isWriting = false;
    }
  }

  private formatMoney(value: string): string {
    // Format tiền Việt với dấu chấm phân cách nghìn
    // Ví dụ: '1000000' => '1.000.000'
    if (!value) return '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.isWriting = true;
    if (value != null && value !== '') {
      // Khi viết giá trị vào input, luôn format
      this.el.nativeElement.value = this.formatMoney(value.toString());
    } else {
      this.el.nativeElement.value = '';
    }
    this.isWriting = false;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
