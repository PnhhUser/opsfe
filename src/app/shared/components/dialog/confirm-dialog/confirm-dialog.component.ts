import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <!-- Backdrop với transition mượt -->
    <div
      class="fixed inset-0 z-50 overflow-y-auto"
      [class]="visible ? 'flex items-center justify-center' : 'hidden'"
    >
      <div
        class="fixed inset-0 bg-black/50 transition-opacity duration-300"
        [class]="visible ? 'opacity-100' : 'opacity-0'"
        (click)="onBackdropClick()"
      ></div>

      <!-- Dialog container -->
      <div
        class="relative transform transition-all duration-300 ease-out"
        [class]="
          visible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95'
        "
      >
        <!-- Dialog content -->
        <div
          class="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-4"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2
              class="text-lg font-semibold text-gray-900 flex items-center gap-2"
            >
              <svg
                *ngIf="icon"
                [class]="iconClasses"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  [attr.stroke-linecap]="iconStrokeLinecap"
                  [attr.stroke-linejoin]="iconStrokeLinejoin"
                  [attr.d]="iconPath"
                />
              </svg>
              {{ title }}
            </h2>
          </div>

          <!-- Body -->
          <div class="px-6 py-5">
            <ng-container *ngIf="loading; else contentTemplate">
              <div class="flex flex-col items-center justify-center py-4">
                <app-loading
                  class="mb-3"
                  [size]="loadingSize"
                  [color]="loadingColor"
                />
                <p class="text-gray-600">
                  {{ loadingText || 'Đang xử lý...' }}
                </p>
              </div>
            </ng-container>

            <ng-template #contentTemplate>
              <div class="mb-1 text-gray-700" [innerHTML]="message"></div>
            </ng-template>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              (click)="cancel.emit()"
              [disabled]="loading"
            >
              {{ cancelText || 'Hủy' }}
            </button>
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              [class]="confirmButtonClass"
              (click)="confirm.emit()"
              [disabled]="loading"
            >
              {{ confirmText || 'Xác nhận' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  @Input() title: string = 'Xác nhận';
  @Input() message: string = '';
  @Input() loading: boolean = false;
  @Input() loadingText: string = '';
  @Input() loadingSize: 'sm' | 'md' | 'lg' = 'md';
  @Input() loadingColor: 'primary' | 'secondary' = 'primary';
  @Input() cancelText: string = '';
  @Input() confirmText: string = '';
  @Input() confirmButtonClass: string = 'bg-blue-600 hover:bg-blue-700';
  @Input() icon: string = '';
  @Input() iconPath: string = '';
  @Input() iconClasses: string = 'w-5 h-5';
  @Input() iconStrokeLinecap: string = 'round';
  @Input() iconStrokeLinejoin: string = 'round';
  @Input() closeOnBackdropClick: boolean = true;
  @Input() visible: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onBackdropClick() {
    if (this.closeOnBackdropClick && !this.loading) {
      this.cancel.emit();
    }
  }
}
