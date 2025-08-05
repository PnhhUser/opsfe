import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, map, Observable, take } from 'rxjs';

import { ILoadPosition } from '../../../core/interfaces/position.interface';
import {
  selectPositionLoading,
  selectPositions,
} from '../../../store/positions/position.selector';
import { ActionPosition } from '../../../store/positions/position.actions';

@Component({
  selector: 'app-remove-position',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  template: `<app-confirm-dialog
    *ngIf="showConfirm"
    [message]="'Bạn có chắc muốn xóa ' + pendingData?.name + ' không?'"
    [loading]="(loading$ | async) ?? false"
    (confirm)="confirm()"
    (cancel)="cancel()"
  ></app-confirm-dialog>`,
})
export class RemovePositionComponent {
  showConfirm = true;

  pendingData: ILoadPosition | null = null;

  loading$: Observable<boolean>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    this.loading$ = this.store.select(selectPositionLoading);
  }

  ngOnInit() {
    const positionId = this.activatedRoute.snapshot.params?.['positionId'];

    if (!positionId) {
      this.router.navigateByUrl('/module/human-resources/positions');
      return;
    }

    this.store
      .select(selectPositions)
      .pipe(
        map((data) => {
          return data
            .filter((v) => v.positionId === Number.parseInt(positionId))
            .find((v) => v);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.pendingData = data;
        }
      });
  }

  confirm() {
    if (!this.pendingData) return;

    this.store.dispatch(
      ActionPosition.removePosition({
        positionId: this.pendingData.positionId,
      })
    );

    // Đợi kết quả xử lý sau khi dispatch
    this.loading$
      .pipe(
        distinctUntilChanged(),
        filter((loading) => loading === false),
        take(1)
      )
      .subscribe(() => {
        this.showConfirm = false;
        this.pendingData = null;
        this.router.navigateByUrl('/module/human-resources/positions');
      });
  }

  cancel() {
    this.showConfirm = false;
    this.pendingData = null;

    this.router.navigateByUrl('/module/human-resources/positions');
  }
}
