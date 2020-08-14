import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { LoadSubscriptionAction, LoadSubscriptionFailureAction, LoadSubscriptionSuccessAction, SubscriptionActionTypes
, DeleteSubscriptionAction, DeleteSubscriptionSuccessAction, DeleteSubscriptionFailureAction,
AddSubscriptionAction, AddSubscriptionSuccessAction, AddSubscriptionFailureAction,
UpdateSubscriptionAction, UpdateSubscriptionSuccessAction, UpdateSubscriptionFailureAction} from '../actions/subscription.action'
import { of } from 'rxjs';
import { SubscriptionService } from '../../subscription/subscription.service';

@Injectable()

export class SubscriptionEffects{

  @Effect() loadSubscription = this.actions
    .pipe(
      ofType<LoadSubscriptionAction>(SubscriptionActionTypes.LOAD_SUBSCRIPTION),
      mergeMap(
        () => this.SubscriptionService.getSubscriptionItem()
          .pipe(
            map(data => {
              return new LoadSubscriptionSuccessAction(data)
            }),
            catchError(error => of(new LoadSubscriptionFailureAction(error)))
          )
      ),
  )

  @Effect() deleteSubscriptionItem$ = this.actions
    .pipe(
      ofType<DeleteSubscriptionAction>(SubscriptionActionTypes.DELETE_SUBSCRIPTION),
      mergeMap(
        (data) => this.SubscriptionService.deleteSubscriptionItem(data.payload)
          .pipe(
            map(() => new DeleteSubscriptionSuccessAction(data.payload)),
            catchError(error => of(new DeleteSubscriptionFailureAction(error)))
          )
      ), 
    )

    @Effect() addSubscriptionItem$ = this.actions
    .pipe(
      ofType<AddSubscriptionAction>(SubscriptionActionTypes.ADD_SUBSCRIPTION),
      mergeMap(
        (data) => this.SubscriptionService.addSubscriptionItem(data.payload)
          .pipe(
            map(() => new AddSubscriptionSuccessAction(data.payload)),
            catchError(error => of(new AddSubscriptionFailureAction(error)))
          )
      )
  )

  @Effect() UpdateSubscriptionItem$ = this.actions
    .pipe(
      ofType<UpdateSubscriptionAction>(SubscriptionActionTypes.UPDATE_SUBSCRIPTION),
      mergeMap(
        (data) => this.SubscriptionService.UpdateSubscriptionItem(data.payload)
          .pipe(
            map(() => new UpdateSubscriptionSuccessAction(data.payload)),
            catchError(error => of(new UpdateSubscriptionFailureAction(error)))
          )
          
      )
  )
  constructor(
    private actions: Actions,
    private SubscriptionService: SubscriptionService
  ) { }

}