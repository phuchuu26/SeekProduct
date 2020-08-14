import { SubscriptionReducer } from '../reducers/subscription.reducers';
import { SubscriptionState } from '../../store/reducers/subscription.reducers';

export interface AppState {
  readonly user: SubscriptionState
}