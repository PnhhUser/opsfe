// Import các module cần thiết từ Angular, Router, AG Grid và các service/model nội bộ
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  ColDef,
  GridReadyEvent,
  RowClickedEvent,
  ICellRendererParams,
  GridApi,
} from 'ag-grid-community';
import { CRUDComponent } from '../../shared/components/crud/crud.component';
import { ILoadAccount } from '../../core/interfaces/account.interface';
import { Store } from '@ngrx/store';
import * as AccountActions from '../../store/accounts/account.actions';
import {
  selectAccountError,
  selectAccounts,
  selectAccountsLoading,
} from '../../store/accounts/account.selectors';
import { TableComponent } from '../../shared/components/table/table.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { Utils } from '../../core/utils/index.utils';
import { Subject, takeUntil, tap } from 'rxjs';
import { ToastService } from '../../core/services/toast.service';
import { IRole } from '../../core/interfaces/role.interface';

@Component({
  selector: 'app-account',
  standalone: true,
  templateUrl: './accounts.component.html',
  imports: [
    CommonModule,
    CRUDComponent,
    RouterOutlet,
    TableComponent,
    LoadingComponent,
  ],
})
export class AccountComponent {
  parentLabel = 'Back';
  selectAccountItem: { id: number } | null = null;
  gridApi!: GridApi;
  prefixRouter: string;

  accounts$;
  loading$;
  error$;

  // Định nghĩa các cột hiển thị trong AG Grid
  columnDefs: ColDef<ILoadAccount>[] = [
    { field: 'username', sortable: true, filter: true, minWidth: 100 },
    {
      field: 'role',
      headerName: 'Role',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        const role: IRole = params.value;

        const isAdmin = role?.key === 'admin';

        const label = isAdmin ? 'Admin' : role?.key;
        const badgeClass = !isAdmin
          ? 'bg-blue-50 text-blue-700 ring-blue-700/10'
          : 'bg-red-50 text-red-700 ring-red-700/10';

        return `
      <span class="inline-flex justify-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ${badgeClass} ring-inset min-w-[70px] capitalize">
        ${label}
      </span>
    `;
      },
      minWidth: 100,
      maxWidth: 120,
    },
    // Active / Inactive badge
    {
      field: 'isActive',
      headerName: 'Status',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        const isActive = params.value;
        const label = isActive ? 'Active' : 'Inactive';
        const badgeClass = isActive
          ? 'bg-green-50 text-green-700 ring-green-700/10'
          : 'bg-red-50 text-red-700 ring-red-700/10';

        return `
      <span class="inline-flex justify-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ${badgeClass} ring-inset min-w-[70px]">
        ${label}
      </span>
    `;
      },
      minWidth: 100,
      maxWidth: 120,
    },

    // Online / Offline badge
    {
      field: 'lastseen',
      headerName: 'Online',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        const isOnline = params.value;
        const label = isOnline ? 'Online' : 'Offline';
        const badgeClass = isOnline
          ? 'bg-blue-50 text-blue-700 ring-blue-700/10'
          : 'bg-gray-50 text-gray-700 ring-gray-700/10';

        return `
      <span class="inline-flex justify-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ${badgeClass} ring-inset min-w-[70px]">
        ${label}
      </span>
    `;
      },
      minWidth: 100,
      maxWidth: 120,
    },

    // Hiển thị ngày tạo và ngày cập nhật
    {
      field: 'createdAt',
      headerName: 'Date Added',
      sortable: true,
      cellRenderer: ({ value }: ICellRendererParams) =>
        Utils.toLocaleDatetimeString(value),
      minWidth: 100,
      maxWidth: 180,
    },
    {
      field: 'updatedAt',
      headerName: 'Date Editd',
      sortable: true,
      cellRenderer: ({ value }: ICellRendererParams) =>
        Utils.toLocaleDatetimeString(value),
      minWidth: 100,
      maxWidth: 180,
    },
  ];

  // Dữ liệu hàng cho bảng
  accounts: ILoadAccount[] = [];

  destroy$ = new Subject<void>();

  // Inject các service cần thiết
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private toastService: ToastService
  ) {
    // Lấy breadcrumb từ route cha để hiển thị label quay về
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : this.parentLabel;
    this.prefixRouter = Utils.getFullRoutePath(this.activatedRoute.snapshot);

    this.accounts$ = this.store.select(selectAccounts);
    this.loading$ = Utils.withMinDelay(
      this.store.select(selectAccountsLoading)
    );

    this.error$ = this.store
      .select(selectAccountError)
      .pipe(
        tap((error) => {
          if (error) {
            this.toastService.error(`${error.message}`, 'System');
            this.store.dispatch(AccountActions.resetAccountError());
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  // Gọi khi component được khởi tạo
  ngOnInit() {
    this.accounts$
      .pipe(
        tap((accounts: ILoadAccount[]) => {
          this.accounts = accounts.map((account: ILoadAccount) => ({
            accountId: account.accountId,
            roleId: account.roleId,
            role: account.role,
            username: account.username,
            isActive: account.isActive,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
            lastseen: account.lastseen,
          }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  // Kiểm tra có đang ở route cha hay không
  isParentRoute(): boolean {
    const currentRoute = this.activatedRoute;
    return !currentRoute.firstChild;
  }

  // Xử lý quay lại route cha
  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  // Gọi khi bảng khởi tạo lần đầu
  onGridReady(event: GridReadyEvent) {
    this.gridApi = event.api;
    event.api.sizeColumnsToFit(); // Tự động fit cột
  }

  // Xử lý sự kiện click vào dòng trong bảng
  onRowClicked(event: RowClickedEvent) {
    const accountId = event.data.accountId;
    this.selectAccountItem = { id: accountId };
  }

  onRowSelect(event: { id: number } | null) {
    this.selectAccountItem = event === null ? null : { id: event.id };
  }

  onGirdEvent(gird: { event: GridReadyEvent }) {
    this.gridApi = gird.event.api;
  }

  // xuất CSV
  exportCSV() {
    if (!this.gridApi) return;

    this.gridApi.exportDataAsCsv({
      fileName: 'DanhSachTaiKhoan.csv',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
