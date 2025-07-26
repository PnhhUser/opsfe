import { IError } from '../../core/interfaces/error.interface';
import { createAction, props } from '@ngrx/store';
import {
  IAccount,
  ILoadAccount,
  IUpdateAccount,
} from '../../core/interfaces/account.interface';
import { AccountModel } from '../../core/models/account.model';

// load accounts
export const loadAccount = createAction('[Account] Load account');

export const loadAccountSuccess = createAction(
  '[Account] Load account success',
  props<{ accounts: ILoadAccount[] }>()
);

export const loadAccountFailure = createAction(
  '[Account] Load account failure',
  props<{ error: IError }>()
);

// add account
export const addAccount = createAction(
  '[Account] Add account',
  props<{ account: AccountModel }>()
);

export const addAccountSuccess = createAction(
  '[Account] Add account success',
  props<{ account: ILoadAccount }>()
);

export const addAccountFailure = createAction(
  '[Account] Add account failure',
  props<{ error: IError }>()
);

// edit account
export const editAccount = createAction(
  '[Account] Edit account',
  props<{ account: IUpdateAccount }>()
);

export const editAccountSuccess = createAction(
  '[Account] Edit account success',
  props<{ account: ILoadAccount }>()
);

export const editAccountFailure = createAction(
  '[Account] Edit account Failure',
  props<{ error: IError }>()
);

// remove account
export const removeAccount = createAction('[Account] Remove account');

export const removeAccountSuccess = createAction(
  '[Account] Remove account Success',
  props<{ accountId: number }>()
);

export const removeAccountFailure = createAction(
  '[Account] Remove account failure',
  props<{ error: IError }>()
);
