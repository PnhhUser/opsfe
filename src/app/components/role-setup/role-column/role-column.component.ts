// role-column.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { rolesColumn } from '../role-setup.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-column',
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="space-y-2 w-full sm:w-56">
    <p class="text-sm ms-1 font-semibold text-gray-700">Role Column</p>
    <div
      class="h-96 bg-white border border-gray-400 rounded shadow overflow-y-auto"
    >
      <div
        *ngFor="let role of roles"
        class="px-3 py-2 cursor-pointer hover:bg-blue-100 transition text-sm border-b border-gray-300"
        [ngClass]="{ 'bg-blue-200': role.selected }"
        (click)="onRoleClick(role)"
      >
        {{ role.key }}
      </div>
    </div>
  </div>`,
})
export class RoleColumnComponent {
  @Input() roles: rolesColumn[] = [];
  @Output() roleSelected = new EventEmitter<rolesColumn>();
  @Output() roleDeselected = new EventEmitter<number>();

  onRoleClick(role: rolesColumn) {
    if (role.selected) {
      this.roleDeselected.emit(role.itemId);
    } else {
      this.roleSelected.emit(role);
    }
  }
}
