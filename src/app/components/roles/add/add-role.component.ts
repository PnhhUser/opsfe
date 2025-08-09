import { CommonModule } from '@angular/common';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { Component } from '@angular/core';
import { IRole } from '../../../core/interfaces/role.interface';
import { IField } from '../../../core/interfaces/field.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectRolesError,
  selectRolesLoading,
} from '../../../store/role/role.selector';
import { ActionRole } from '../../../store/role/role.actions';
import { filter, pairwise, take } from 'rxjs';

@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [
    CommonModule,
    PanelComponent,
    ConfirmDialogComponent,
    DynamicFormComponent,
  ],
  template: `<button
      (click)="goBack()"
      class="flex items-center text-sm text-blue-600 hover:underline mb-4"
    >
      ← {{ parentLabel }}
    </button>

    <app-panel [column]="1">
      <app-dynamic-form
        [fields]="roleField"
        (formSubmit)="submitUserForm($event)"
        [messageError]="(error$ | async)?.message ?? messageError"
      ></app-dynamic-form>
    </app-panel>

    <app-confirm-dialog
      *ngIf="showConfirm"
      [message]="'Bạn có chắc muốn thêm ' + pendingData?.name + ' không?'"
      [loading]="(loading$ | async) ?? false"
      (confirm)="confirmAdd()"
      (cancel)="cancelAdd()"
    ></app-confirm-dialog> `,
})
export class AddRoleComponent {
  parentLabel = 'Back';
  messageError: string = '';
  showConfirm = false;
  pendingData: IRole | null = null;

  loading$;
  error$;

  roleField: IField<keyof IRole>[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'key', label: 'Key', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';

    this.loading$ = this.store.select(selectRolesLoading);
    this.error$ = this.store.select(selectRolesError);
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  submitUserForm(data: IRole) {
    try {
      if (data.key.includes(' ')) {
        throw new Error('Key must not contain spaces');
      }

      this.pendingData = data;
      this.showConfirm = true;
    } catch (e) {
      if (e instanceof Error) {
        this.messageError = e.message;
      } else {
        console.error('Error: ', e);
      }
    }
  }

  confirmAdd() {
    if (!this.pendingData) return;

    this.store.dispatch(ActionRole.addRole({ role: this.pendingData }));

    // Đợi kết quả xử lý sau khi dispatch
    this.loading$
      .pipe(
        pairwise(),
        filter(([prev, curr]) => prev === true && curr === false),
        take(1)
      )
      .subscribe(() => {
        this.error$.pipe(take(1)).subscribe((error) => {
          this.showConfirm = false;
          if (!error) {
            this.pendingData = null;
            this.router.navigate(['../'], { relativeTo: this.activatedRoute });
          }
        });
      });
  }

  cancelAdd() {
    this.showConfirm = false;
    this.pendingData = null;
  }
}
