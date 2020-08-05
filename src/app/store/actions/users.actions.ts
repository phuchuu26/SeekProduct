import {Action} from '@ngrx/store';
import {Users} from '../models/users.model';

export enum UsersActionTypes {
    LOAD_USERS = '[USERS] Load Users',
    LOAD_USERS_SUCCESS = '[USERS] Load Users Success',
    LOAD_USERS_FAILURE = '[USERS] Load Users Failure',
    DELETE_USERS = '[USERS] Delete USERS',
    DELETE_USERS_SUCCESS = '[USERS] Delete USERS Success',
    DELETE_USERS_FAILURE = '[USERS] Delete USERS Failure',
    ADD_USERS = '[USERS] Add USERS',
    ADD_USERS_SUCCESS = '[USERS] Add USERS Success',
    ADD_USERS_FAILURE = '[USERS] Add USERS Failure',
    UPDATE_USERS = '[USERS] UPDATE USERS',
    UPDATE_USERS_SUCCESS = '[USERS] UPDATE USERS Success',
    UPDATE_USERS_FAILURE = '[USERS] UPDATE USERS Failure',
  }
  
  export class LoadUsersAction implements Action {
    readonly type = UsersActionTypes.LOAD_USERS
  }
  export class LoadUsersSuccessAction implements Action {
    readonly type = UsersActionTypes.LOAD_USERS_SUCCESS
  
    constructor(public payload: Array<Users>) {}
  
  }
  export class LoadUsersFailureAction implements Action {
    readonly type = UsersActionTypes.LOAD_USERS_FAILURE
    
    constructor(public payload: string) {}
  }
  export class DeleteUsersAction implements Action {
    readonly type = UsersActionTypes.DELETE_USERS
  
    constructor(public payload: number) { }
  }
  
  export class DeleteUsersSuccessAction implements Action {
    readonly type = UsersActionTypes.DELETE_USERS_SUCCESS
  
    constructor(public payload: number) { }
  }
  export class DeleteUsersFailureAction implements Action {
    readonly type = UsersActionTypes.DELETE_USERS_FAILURE
  
    constructor(public payload: number) { }
  }

  export class AddUsersAction implements Action {
    readonly type = UsersActionTypes.ADD_USERS
  
    constructor(public payload: Users) { }
  }
  export class AddUsersSuccessAction implements Action {
    readonly type = UsersActionTypes.ADD_USERS_SUCCESS
  
    constructor(public payload: Users) { }
  }
  export class AddUsersFailureAction implements Action {
    readonly type = UsersActionTypes.ADD_USERS_FAILURE
  
    constructor(public payload: Error) { }
  }

  export class UpdateUsersAction implements Action {
    readonly type = UsersActionTypes.UPDATE_USERS
  
    constructor(public payload: Users) { }
  }
  export class UpdateUsersSuccessAction implements Action {
    readonly type = UsersActionTypes.UPDATE_USERS_SUCCESS
  
    constructor(public payload: Users) { }
  }
  export class UpdateUsersFailureAction implements Action {
    readonly type = UsersActionTypes.UPDATE_USERS_FAILURE
  
    constructor(public payload: Error) { }
  }
  
  
  
  export type UsersAction = LoadUsersAction | LoadUsersSuccessAction | LoadUsersFailureAction
                            | DeleteUsersAction | DeleteUsersSuccessAction | DeleteUsersFailureAction
                            | AddUsersAction | AddUsersSuccessAction | AddUsersFailureAction
                            | UpdateUsersAction | UpdateUsersSuccessAction | UpdateUsersFailureAction