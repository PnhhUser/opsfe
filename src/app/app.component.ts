import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppComponent {
  constructor(private store: Store) {}

  ngOnInit(): void {
    const hasLogin = localStorage.getItem('hasLogin');

    if (hasLogin) {
      this.store.dispatch(AuthActions.checkAuth());
    }
  }
}
