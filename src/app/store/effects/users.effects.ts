import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { LoadUsersAction, LoadUsersFailureAction, LoadUsersSuccessAction, UsersActionTypes
, DeleteUsersAction, DeleteUsersSuccessAction, DeleteUsersFailureAction,
AddUsersAction, AddUsersSuccessAction, AddUsersFailureAction,
UpdateUsersAction, UpdateUsersSuccessAction, UpdateUsersFailureAction} from '../actions/users.actions'
import { of } from 'rxjs';
import { UsersService } from '../../../app/users.service';

@Injectable()

export class UsersEffects{

  @Effect() loadUser = this.actions
    .pipe(
      ofType<LoadUsersAction>(UsersActionTypes.LOAD_USERS),
      mergeMap(
        () => this.usersService.getUserItem()
          .pipe(
            map(data => {
              return new LoadUsersSuccessAction(data)
            }),
            catchError(error => of(new LoadUsersFailureAction(error)))
          )
      ),
  )

  @Effect() deleteUserItem$ = this.actions
    .pipe(
      ofType<DeleteUsersAction>(UsersActionTypes.DELETE_USERS),
      mergeMap(
        (data) => this.usersService.deleteUserItem(data.payload)
          .pipe(
            map(() => new DeleteUsersSuccessAction(data.payload)),
            catchError(error => of(new DeleteUsersFailureAction(error)))
          )
      ), 
    )

    @Effect() addUserItem$ = this.actions
    .pipe(
      ofType<AddUsersAction>(UsersActionTypes.ADD_USERS),
      mergeMap(
        (data) => this.usersService.addUserItem(data.payload)
          .pipe(
            map(() => new AddUsersSuccessAction(data.payload)),
            catchError(error => of(new AddUsersFailureAction(error)))
          )
      )
  )

  @Effect() UpdateUserItem$ = this.actions
    .pipe(
      ofType<UpdateUsersAction>(UsersActionTypes.UPDATE_USERS),
      mergeMap(
        (data) => this.usersService.UpdateUserItem(data.payload)
          .pipe(
            map(() => new UpdateUsersSuccessAction(data.payload)),
            catchError(error => of(new UpdateUsersFailureAction(error)))
          )
          
      )
  )
  constructor(
    private actions: Actions,
    private usersService: UsersService
  ) { }

}