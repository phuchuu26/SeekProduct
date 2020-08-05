import { UsersState } from '../reducers/users.reducers';

export interface AppState {
  readonly user: UsersState
}