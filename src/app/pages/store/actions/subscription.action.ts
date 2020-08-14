import {Action} from '@ngrx/store';
import {Subscription} from '../../store/models/subscription.model';

export enum SubscriptionActionTypes {
    LOAD_SUBSCRIPTION = '[SUBSCRIPTION] Load SUBSCRIPTION',
    LOAD_SUBSCRIPTION_SUCCESS = '[SUBSCRIPTION] Load SUBSCRIPTION Success',
    LOAD_SUBSCRIPTION_FAILURE = '[SUBSCRIPTION] Load SUBSCRIPTION Failure',
    DELETE_SUBSCRIPTION = '[SUBSCRIPTION] Delete SUBSCRIPTION',
    DELETE_SUBSCRIPTION_SUCCESS = '[SUBSCRIPTION] Delete SUBSCRIPTION Success',
    DELETE_SUBSCRIPTION_FAILURE = '[SUBSCRIPTION] Delete SUBSCRIPTION Failure',
    ADD_SUBSCRIPTION = '[SUBSCRIPTION] Add SUBSCRIPTION',
    ADD_SUBSCRIPTION_SUCCESS = '[SUBSCRIPTION] Add SUBSCRIPTION Success',
    ADD_SUBSCRIPTION_FAILURE = '[SUBSCRIPTION] Add SUBSCRIPTION Failure',
    UPDATE_SUBSCRIPTION = '[SUBSCRIPTION] UPDATE SUBSCRIPTION',
    UPDATE_SUBSCRIPTION_SUCCESS = '[SUBSCRIPTION] UPDATE SUBSCRIPTION Success',
    UPDATE_SUBSCRIPTION_FAILURE = '[SUBSCRIPTION] UPDATE SUBSCRIPTION Failure',
  }
  
  export class LoadSubscriptionAction implements Action {
    readonly type = SubscriptionActionTypes.LOAD_SUBSCRIPTION
  }
  export class LoadSubscriptionSuccessAction implements Action {
    readonly type = SubscriptionActionTypes.LOAD_SUBSCRIPTION_SUCCESS
  
    constructor(public payload: Array<Subscription>) {}
  
  }
  export class LoadSubscriptionFailureAction implements Action {
    readonly type = SubscriptionActionTypes.LOAD_SUBSCRIPTION_FAILURE
    
    constructor(public payload: string) {}
  }
  export class DeleteSubscriptionAction implements Action {
    readonly type = SubscriptionActionTypes.DELETE_SUBSCRIPTION
  
    constructor(public payload: number) { }
  }
  
  export class DeleteSubscriptionSuccessAction implements Action {
    readonly type = SubscriptionActionTypes.DELETE_SUBSCRIPTION_SUCCESS
  
    constructor(public payload: number) { }
  }
  export class DeleteSubscriptionFailureAction implements Action {
    readonly type = SubscriptionActionTypes.DELETE_SUBSCRIPTION_FAILURE
  
    constructor(public payload: number) { }
  }

  export class AddSubscriptionAction implements Action {
    readonly type = SubscriptionActionTypes.ADD_SUBSCRIPTION
  
    constructor(public payload: Subscription) { }
  }
  export class AddSubscriptionSuccessAction implements Action {
    readonly type = SubscriptionActionTypes.ADD_SUBSCRIPTION_SUCCESS
  
    constructor(public payload: Subscription) { }
  }
  export class AddSubscriptionFailureAction implements Action {
    readonly type = SubscriptionActionTypes.ADD_SUBSCRIPTION_FAILURE
  
    constructor(public payload: Error) { }
  }

  export class UpdateSubscriptionAction implements Action {
    readonly type = SubscriptionActionTypes.UPDATE_SUBSCRIPTION
  
    constructor(public payload: Subscription) { }
  }
  export class UpdateSubscriptionSuccessAction implements Action {
    readonly type = SubscriptionActionTypes.UPDATE_SUBSCRIPTION_SUCCESS
  
    constructor(public payload: Subscription) { }
  }
  export class UpdateSubscriptionFailureAction implements Action {
    readonly type = SubscriptionActionTypes.UPDATE_SUBSCRIPTION_FAILURE
  
    constructor(public payload: Error) { }
  }
  
  
  
  export type SubscriptionAction = LoadSubscriptionAction | LoadSubscriptionSuccessAction | LoadSubscriptionFailureAction
                            | DeleteSubscriptionAction | DeleteSubscriptionSuccessAction | DeleteSubscriptionFailureAction
                            | AddSubscriptionAction | AddSubscriptionSuccessAction | AddSubscriptionFailureAction
                            | UpdateSubscriptionAction | UpdateSubscriptionSuccessAction | UpdateSubscriptionFailureAction