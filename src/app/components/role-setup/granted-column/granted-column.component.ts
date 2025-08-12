// granted-column.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { permissionsColumn } from '../role-setup.interface';

@Component({
  selector: 'app-granted-column',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: ` <div class="space-y-2 w-full sm:w-56">
    <div class="flex justify-between items-center">
      <p class="text-sm ms-1 font-semibold text-gray-700">Granted Column</p>
      <lucide-icon
        name="check"
        size="16"
        class="cursor-pointer text-[#10c11c]"
        (click)="submitChanges.emit()"
      >
      </lucide-icon>
    </div>
    <div
      class="h-96 bg-white border border-gray-400 rounded shadow overflow-y-auto"
    >
      <div
        *ngFor="let item of granted"
        class="px-3 py-2 cursor-pointer bg-gray-100 hover:bg-blue-100 transition text-sm border-b border-gray-300"
        (click)="onItemClick(item)"
      >
        <div class="flex items-center justify-between">
          <p>{{ item.key }}</p>
          <lucide-icon
            name="x"
            size="14"
            color="#e93535"
            *ngIf="item.selected"
          ></lucide-icon>
        </div>
      </div>
    </div>
  </div>`,
})
export class GrantedColumnComponent {
  @Input() granted: permissionsColumn[] = [];
  @Output() itemSelected = new EventEmitter<permissionsColumn>();
  @Output() submitChanges = new EventEmitter<void>();

  onItemClick(item: permissionsColumn) {
    this.itemSelected.emit(item);
  }
}
