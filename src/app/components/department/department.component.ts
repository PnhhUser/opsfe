import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CRUDComponent } from '../../shared/components/crud/crud.component';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import {
  selectDepartmentLoading,
  selectDepartments,
} from '../../store/departments/department.selectors';
import { IloadDepartment } from '../../core/interfaces/department.interface';
import { ActionDepartment } from '../../store/departments/department.actions';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { Utils } from '../../core/utils/index.utils';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CRUDComponent,
    LoadingComponent,
    TableComponent,
  ],
  templateUrl: './department.component.html',
})
export class DepartmentComponent {
  parentLabel = 'Back';
  selectDepartmentItem: { id: number } | null = null;
  gridApi!: GridApi;
  prefixRouter: string;
  departments: IloadDepartment[] = [];
  columnDefs: ColDef<IloadDepartment>[] = [
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
      field: 'createAt',
      headerName: 'Date Added',
      sortable: true,
      hide: true,
    },
    {
      field: 'updateAt',
      headerName: 'Date Edited',
      sortable: true,
      hide: true,
    },
  ];
  loading$;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : this.parentLabel;
    this.prefixRouter = Utils.getFullRoutePath(this.activatedRoute.snapshot);
    this.loading$ = Utils.withMinDelay(
      this.store.select(selectDepartmentLoading)
    );
  }

  ngOnInit(): void {
    this.store.dispatch(ActionDepartment.loadDepartments());
    this.store
      .select(selectDepartments)
      .subscribe((departments: IloadDepartment[]) => {
        this.departments = departments.map((position) => {
          return {
            departmentId: position.departmentId,
            name: position.name,
            key: position.key,
            description: position.description,
            updateAt: Utils.toLocaleDateString(position.updateAt),
            createAt: Utils.toLocaleDateString(position.createAt),
          };
        });
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
    this.selectDepartmentItem = event === null ? null : { id: event.id };
  }

  onGirdEvent(gird: { event: GridReadyEvent }) {
    this.gridApi = gird.event.api;
  }

  exportCSV() {
    if (!this.gridApi) return;
    this.gridApi.exportDataAsCsv({
      fileName: 'DanhSachPhongBan.csv',
    });
  }
}
