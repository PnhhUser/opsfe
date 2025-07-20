import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth/auth.actions';
import { selectLoading, selectUser } from './store/auth/auth.selectors';
import { combineLatest, filter, Observable, take } from 'rxjs';
import { IUser } from './core/models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppComponent {
  user$: Observable<IUser | null>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.store
      .select(selectUser)
      .pipe(take(1))
      .subscribe((user) => {
        if (!user) {
          this.store.dispatch(AuthActions.checkAuth());
        }
      });
  }
}
