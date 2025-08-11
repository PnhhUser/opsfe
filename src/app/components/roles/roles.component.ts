import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CRUDComponent } from '../../shared/components/crud/crud.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { ILoadRoles } from '../../core/interfaces/role.interface';
import { Utils } from '../../core/utils/index.utils';
import { Store } from '@ngrx/store';
import {
  selectRoles,
  selectRolesError,
  selectRolesLoading,
} from '../../store/role/role.selector';
import { ActionRole } from '../../store/role/role.actions';
import { filter, Subject, take, takeUntil, tap } from 'rxjs';
import { Toast } from 'ngx-toastr';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    CRUDComponent,
    TableComponent,
    RouterOutlet,
    LoadingComponent,
  ],
  templateUrl: './roles.component.html',
})
export class RolesComponent {
  parentLabel = 'Back';
  selectRoleItem: { id: number } | null = null;
  gridApi!: GridApi;
  prefixRouter: string;
  loading$;
  columnDefs: ColDef<ILoadRoles>[] = [
    {
      field: 'name',
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 500,
    },
    {
      field: 'key',
      headerName: 'Code',
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 100,
    },
    { field: 'description', minWidth: 500 },
    {
      field: 'createdAt',
      headerName: 'Date Added',
      sortable: true,
      cellRenderer: ({ value }: ICellRendererParams) => {
        return Utils.toLocaleDatetimeString(value);
      },
      minWidth: 100,
      maxWidth: 160,
    },
    {
      field: 'updatedAt',
      headerName: 'Date Edited',
      sortable: true,
      cellRenderer: ({ value }: ICellRendererParams) =>
        Utils.toLocaleDatetimeString(value),
      minWidth: 100,
      maxWidth: 160,
    },
  ];

  destroy$ = new Subject<void>();

  roles$;
  error$;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private toastService: ToastService
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : this.parentLabel;
    this.prefixRouter = Utils.getFullRoutePath(this.activatedRoute.snapshot);

    this.loading$ = Utils.withMinDelay(this.store.select(selectRolesLoading));

    this.roles$ = this.store.select(selectRoles);

    this.error$ = this.store
      .select(selectRolesError)
      .pipe(
        tap((error) => {
          if (error) {
            this.toastService.error(`${error.message}`, 'Role Error');
            this.store.dispatch(ActionRole.resetAccountError());
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnInit() {
    this.store.dispatch(ActionRole.loadRoles());
  }

  isParentRoute(): boolean {
    const currentRoute = this.activatedRoute;
    return !currentRoute.firstChild;
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  onRowSelect(event: { id: number } | null) {
    this.selectRoleItem = event === null ? null : { id: event.id };
  }

  onGirdEvent(gird: { event: GridReadyEvent }) {
    this.gridApi = gird.event.api;
  }

  exportCSV() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
