import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer-buttons',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: ` <div
    class="flex flex-row sm:flex-col items-center justify-center space-x-2 sm:space-x-0 sm:space-y-2"
  >
    <button
      class="text-gray-900 bg-white p-2 w-32 h-10 flex justify-center items-center gap-1 cursor-pointer hover:bg-blue-100 rounded shadow"
      (click)="select.emit()"
    >
      <lucide-icon name="chevron-right" color="#4777d7" size="18"></lucide-icon>
    </button>

    <button
      *ngIf="showSelectAll"
      class="text-gray-900 bg-white p-2 w-32 h-10 flex justify-center items-center gap-1 cursor-pointer hover:bg-blue-100 rounded shadow"
      (click)="selectAll.emit()"
    >
      <lucide-icon
        name="chevrons-right"
        color="#4777d7"
        size="18"
      ></lucide-icon>
    </button>

    <button
      class="text-gray-900 bg-white p-2 w-32 h-10 flex justify-center items-center gap-1 cursor-pointer hover:bg-blue-100 rounded shadow"
      (click)="remove.emit()"
    >
      <lucide-icon name="chevron-left" color="#4777d7" size="18"></lucide-icon>
    </button>

    <button
      *ngIf="showRemoveAll"
      class="text-gray-900 bg-white p-2 w-32 h-10 flex justify-center items-center gap-1 cursor-pointer hover:bg-blue-100 rounded shadow"
      (click)="removeAll.emit()"
    >
      <lucide-icon name="chevrons-left" color="#4777d7" size="18"></lucide-icon>
    </button>
  </div>`,
})
export class TransferButtonsComponent {
  @Input() showSelectAll = true;
  @Input() showRemoveAll = true;

  @Output() select = new EventEmitter<void>();
  @Output() selectAll = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  @Output() removeAll = new EventEmitter<void>();
}
