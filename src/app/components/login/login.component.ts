import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import * as AuthActions from '../../store/auth/auth.actions';
import {
  selectError,
  selectLoading,
  selectUser,
} from '../../store/auth/auth.selectors';
import { IError } from '../../core/interfaces/error.interface';
import { Router } from '@angular/router';
import { ILoginForm } from '../../core/interfaces/auth.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error$: Observable<IError | null>;
  loading$: Observable<boolean>;

  private store = inject(Store);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.error$ = this.store.select(selectError).pipe(
      map((error) => {
        if (!error) return null;
        if (error.source === 'checkAuth') return null;
        return error;
      })
    );

    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit(): void {
    combineLatest([
      this.store.select(selectUser),
      this.store.select(selectLoading),
    ])
      .pipe(
        filter(([_, loading]) => loading === false),
        take(2)
      )
      .subscribe(([user]) => {
        if (user) {
          this.router.navigate(['/']);
        }
      });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get passwordErrors(): string | null {
    const control = this.password;
    if (!control || !control.touched || !control.errors) return null;
    if (control.errors['required']) return 'Password is required.';
    if (control.errors['minlength'])
      return 'Password must be at least 6 characters long.';
    return null;
  }

  get usernameErrors(): string | null {
    const control = this.username;
    if (!control || !control.touched || !control.errors) return null;
    if (control.errors['required']) return 'Username is required.';
    if (control.errors['minlength'])
      return 'Username must be at least 3 characters long.';
    return null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const value: ILoginForm = this.loginForm.value;
      this.store.dispatch(AuthActions.login(value));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
