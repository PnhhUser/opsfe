import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUser } from '../../core/models/user.model';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  user$: Observable<IUser | null>;

  constructor(private store: Store, private router: Router) {
    this.user$ = this.store.select(selectUser);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
