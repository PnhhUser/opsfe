// permission-column.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { permissionsColumn } from '../role-setup.interface';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-permission-column',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `<div class="space-y-2 w-full sm:w-56">
    <p class="text-sm ms-1 font-semibold text-gray-700">Permissions Column</p>
    <div
      class="h-96 bg-white border border-gray-400 rounded shadow overflow-y-auto"
    >
      <div
        *ngFor="let permission of permissions"
        class="px-3 py-2 cursor-pointer bg-white hover:bg-blue-100 transition text-sm border-b border-gray-300"
        (click)="onPermissionClick(permission)"
      >
        <div class="flex items-center justify-between">
          <p>{{ permission.key }}</p>
          <lucide-icon
            name="check"
            size="14"
            color="#10c11c"
            *ngIf="permission.selected"
          ></lucide-icon>
        </div>
      </div>
    </div>
  </div>`,
})
export class PermissionColumnComponent {
  @Input() permissions: permissionsColumn[] = [];
  @Output() permissionSelected = new EventEmitter<permissionsColumn>();

  onPermissionClick(permission: permissionsColumn) {
    this.permissionSelected.emit(permission);
  }
}
