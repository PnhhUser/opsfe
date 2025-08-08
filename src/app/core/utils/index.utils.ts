import { ActivatedRouteSnapshot } from '@angular/router';
import { combineLatest, map, Observable, startWith, timer } from 'rxjs';

// Thời gian chờ load
function withMinDelay(
  loading$: Observable<boolean>,
  ms: number = 500
): Observable<boolean> {
  const minDelay$ = timer(ms).pipe(
    map(() => false),
    startWith(true)
  );

  return combineLatest([loading$, minDelay$]).pipe(
    map(([isLoading, minDelay]) => isLoading || minDelay)
  );
}

// Lấy full path từ một ActivatedRouteSnapshot
function getFullRoutePath(snapshot: ActivatedRouteSnapshot): string {
  return snapshot.pathFromRoot
    .map((r) => r.routeConfig?.path)
    .filter((p): p is string => Boolean(p))
    .join('/');
}

// format thời gian
function toLocaleDatetimeString(datetime: string) {
  return new Date(datetime).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function toLocaleDateString(datetime: string) {
  return new Date(datetime).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// format Vn
function formatVND(amount: number) {
  return amount.toLocaleString('vi-VN');
}

function formatVNDStyle(amount: number) {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export const Utils = {
  getFullRoutePath,
  withMinDelay,
  toLocaleDateString,
  toLocaleDatetimeString,
  formatVND,
  formatVNDStyle,
};
