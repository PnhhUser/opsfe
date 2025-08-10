import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastr: ToastrService) {}

  /**
   * Hiển thị toast thành công
   */
  success(message: string, title?: string) {
    this.toastr.success(message, title, {
      progressBar: true,
      closeButton: true,
      timeOut: 3000,
    });
  }

  /**
   * Hiển thị toast lỗi
   */
  error(message: string, title?: string) {
    this.toastr.error(message, title, {
      progressBar: true,
      closeButton: true,
      timeOut: 5000, // Thời gian hiển thị lâu hơn cho lỗi
    });
  }

  /**
   * Hiển thị toast cảnh báo
   */
  warning(message: string, title?: string) {
    this.toastr.warning(message, title, {
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Hiển thị toast thông tin
   */
  info(message: string, title?: string) {
    this.toastr.info(message, title, {
      progressBar: true,
    });
  }

  /**
   * Hiển thị toast tùy chỉnh
   */
  show(message: string, title: string, config?: any) {
    this.toastr.show(message, title, {
      ...config,
      progressBar: config?.progressBar ?? true,
      closeButton: config?.closeButton ?? true,
    });
  }
}
