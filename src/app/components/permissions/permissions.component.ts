import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { Utils } from '../../core/utils/index.utils';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CRUDComponent } from '../../shared/components/crud/crud.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import {
  selectPermission,
  selectPermissionLoading,
} from '../../store/permission/permission.selector';
import { ILoadPermissions } from '../../core/interfaces/permission.interface';

@Component({
  selector: 'app-permisions',
  standalone: true,
  imports: [
    CommonModule,
    CRUDComponent,
    TableComponent,
    RouterOutlet,
    LoadingComponent,
  ],
  templateUrl: './permission.component.html',
})
export class PermissionsComponent {
  parentLabel = 'Back';
  selectPermissionItem: { id: number } | null = null;
  gridApi!: GridApi;
  prefixRouter: string;
  loading$;
  permissions: ILoadPermissions[] = [];
  columnDefs: ColDef<ILoadPermissions>[] = [
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
      maxWidth: 200,
    },
    { field: 'description', minWidth: 500 },
    {
      field: 'createdAt',
      headerName: 'Date Added',
      sortable: true,
      cellRenderer: ({ value }: ICellRendererParams) =>
        Utils.toLocaleDatetimeString(value),
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : this.parentLabel;
    this.prefixRouter = Utils.getFullRoutePath(this.activatedRoute.snapshot);

    this.loading$ = Utils.withMinDelay(
      this.store.select(selectPermissionLoading)
    );
  }

  ngOnInit() {
    this.store
      .select(selectPermission)
      .subscribe((data: ILoadPermissions[]) => {
        this.permissions = data.map((d) => ({ ...d }));
      });
  }

  isParentRoute(): boolean {
    const currentRoute = this.activatedRoute;
    return !currentRoute.firstChild;
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  onRowSelect(event: { id: number } | null) {
    this.selectPermissionItem = event === null ? null : { id: event.id };
  }

  onGirdEvent(gird: { event: GridReadyEvent }) {
    this.gridApi = gird.event.api;
  }

  exportCSV() {}
}
