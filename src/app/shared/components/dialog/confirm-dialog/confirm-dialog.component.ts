import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full min-h-[150px] flex items-center justify-center"
      >
        <!-- Nếu loading: chỉ hiển thị vòng xoay + text -->
        <ng-container *ngIf="loading; else confirmContent">
          <div class="flex flex-col items-center gap-4">
            <app-loading />
            <p class="text-gray-700">Đang xử lý...</p>
          </div>
        </ng-container>

        <!-- Nội dung xác nhận -->
        <ng-template #confirmContent>
          <div>
            <h2 class="text-lg font-semibold mb-4">Xác nhận</h2>
            <p class="mb-6">{{ message }}</p>
            <div class="flex justify-end gap-3">
              <button
                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                (click)="cancel.emit()"
              >
                Hủy
              </button>
              <button
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                (click)="confirm.emit()"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  @Input() message: string = '';
  @Input() loading: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
