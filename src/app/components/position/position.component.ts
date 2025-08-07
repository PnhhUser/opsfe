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
import { DatetimeUtils } from '../../core/utils/datetime.utils';
import { Observable } from 'rxjs';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { TableComponent } from '../../shared/components/table/table.component';

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
      maxWidth: 200,
    },
    {
      field: 'key',
      headerName: 'Code',
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      field: 'departmentName',
      headerName: 'Department',
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 200,
      cellRenderer: ({ value }: ICellRendererParams) =>
        !value ? 'chưa có' : value,
    },
    {
      field: 'baseSalary',
      headerName: 'Base salary',
      sortable: true,
      minWidth: 100,
      maxWidth: 150,
      cellRenderer: ({ value }: ICellRendererParams) => (!value ? 0 : value),
    },
    {
      field: 'description',
      headerName: 'Description',
      sortable: true,
      minWidth: 140,
      cellRenderer: ({ value }: ICellRendererParams) =>
        !value ? 'Trống' : value,
    },
    {
      field: 'createAt',
      headerName: 'Create date',
      sortable: true,
      hide: true,
    },
    {
      field: 'updateAt',
      headerName: 'Update date',
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
    this.prefixRouter = this.router.url;

    this.positions$ = this.store.select(selectPositions);
    this.loading$ = this.store.select(selectPositionLoading);
  }

  ngOnInit() {
    this.store.dispatch(ActionPosition.loadPositions());

    this.positions$.subscribe((positions: ILoadPosition[]) => {
      this.positions = positions.map((position) => {
        return {
          positionId: position.positionId,
          name: position.name,
          key: position.key,
          departmentName: position.departmentName,
          baseSalary: position.baseSalary,
          description: position.description,
          updateAt: DatetimeUtils.toLocaleDateString(position.updateAt),
          createAt: DatetimeUtils.toLocaleDateString(position.createAt),
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

  exportCSV() {}
}
