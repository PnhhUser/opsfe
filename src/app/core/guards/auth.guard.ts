import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { Observable, of, race, timer } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return race(
      this.store.select(selectUser).pipe(
        filter((user) => !!user), // chờ khi có user
        take(1),
        map(() => true)
      ),
      timer(1000).pipe(
        // hoặc timeout sau 1 giây
        map(() => this.router.createUrlTree(['/login']))
      )
    );
  }
}
