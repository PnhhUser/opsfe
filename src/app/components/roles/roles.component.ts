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
  selectRolesLoading,
} from '../../store/role/role.selector';
import { ActionRole } from '../../store/role/role.actions';
import { filter, take, tap } from 'rxjs';

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
      maxWidth: 220,
    },
    {
      field: 'key',
      headerName: 'Code',
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 180,
    },
    { field: 'description', minWidth: 700 },
    {
      field: 'createdAt',
      headerName: 'Date Added',
      sortable: true,
      cellRenderer: ({ value }: ICellRendererParams) => {
        return Utils.toLocaleDatetimeString(value);
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Date Edited',
      sortable: true,
      cellRenderer: ({ value }: ICellRendererParams) =>
        Utils.toLocaleDatetimeString(value),
    },
  ];

  roles$;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : this.parentLabel;
    this.prefixRouter = Utils.getFullRoutePath(this.activatedRoute.snapshot);

    this.loading$ = Utils.withMinDelay(this.store.select(selectRolesLoading));

    this.roles$ = this.store.select(selectRoles);
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
}
