import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CRUDComponent } from '../../shared/components/crud/crud.component';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  RowClickedEvent,
} from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { ActionPosition } from '../../store/positions/position.actions';
import { ILoadPosition } from '../../core/interfaces/position.interface';
import {
  selectPositionLoading,
  selectPositions,
} from '../../store/positions/position.selector';
import { Observable } from 'rxjs';
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
  templateUrl: './position.component.html',
})
export class PositionComponent {
  parentLabel = 'Back';
  selectPositionItem: { id: number } | null = null;
  gridApi!: GridApi;
  prefixRouter: string;
  positions: ILoadPosition[] = [];
  positions$: Observable<ILoadPosition[]>;
  columnDefs: ColDef<ILoadPosition>[] = [
    {
      field: 'name',
      headerName: 'Position',
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      field: 'key',
      headerName: 'Code',
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      field: 'departmentName',
      headerName: 'Department',
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 200,
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value;

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        Not Assigned
      </span>
    `;
        }

        return value;
      },
    },
    {
      field: 'baseSalary',
      headerName: 'Base salary',
      sortable: true,
      minWidth: 100,
      maxWidth: 120,
      cellRenderer: ({ value }: ICellRendererParams) => {
        return !value ? 0 : Utils.formatVND(Number(value));
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      sortable: true,
      minWidth: 140,
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value;

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        No Description
      </span>
    `;
        }

        return value;
      },
    },
    {
      field: 'createAt',
      headerName: 'Date Added',
      sortable: true,
      minWidth: 100,
      maxWidth: 110,
    },
    {
      field: 'updateAt',
      headerName: 'Date Editd',
      sortable: true,
      minWidth: 100,
      maxWidth: 110,
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

    this.positions$ = this.store.select(selectPositions);
    this.loading$ = Utils.withMinDelay(
      this.store.select(selectPositionLoading)
    );
  }

  ngOnInit() {
    this.positions$.subscribe((positions: ILoadPosition[]) => {
      this.positions = positions.map((position) => {
        return {
          positionId: position.positionId,
          name: position.name,
          key: position.key,
          departmentName: position.departmentName,
          baseSalary: position.baseSalary,
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

  onRowClicked(event: RowClickedEvent) {
    const positionId = event.data.positionId;
    this.selectPositionItem = { id: positionId };
  }

  onRowSelect(event: { id: number } | null) {
    this.selectPositionItem = event === null ? null : { id: event.id };
  }

  onGirdEvent(gird: { event: GridReadyEvent }) {
    this.gridApi = gird.event.api;
  }

  exportCSV() {
    if (!this.gridApi) return;
    this.gridApi.exportDataAsCsv({
      fileName: 'DanhSachViTri.csv',
    });
  }
}
