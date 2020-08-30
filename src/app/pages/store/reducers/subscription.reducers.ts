import { SubscriptionAction, SubscriptionActionTypes } from '../actions/subscription.action';
import { Subscription } from '../models/subscription.model';
import Swal from 'sweetalert2';
import { SubscriptionService } from '../../subscription/subscription.service';
import { combineAll } from 'rxjs/operators';
export interface SubscriptionState {
    list: Subscription[],
    loading: boolean,
    error: Error;
  }
  const initialState: SubscriptionState = {
    list: [],
    loading: false,
    error: undefined
  };
  export function SubscriptionReducer(state: SubscriptionState = initialState, action: SubscriptionAction) {
    switch (action.type) {
      case SubscriptionActionTypes.LOAD_SUBSCRIPTION:
        return {
          ...state,
          loading: true
        }
      case SubscriptionActionTypes.LOAD_SUBSCRIPTION_SUCCESS:
        console.log(action.payload);
        return {
          ...state,
          list: action.payload,
          loading: false
        }
      case SubscriptionActionTypes.LOAD_SUBSCRIPTION_FAILURE:
        return {
          ...state,
          error: action.payload
        }
        case SubscriptionActionTypes.DELETE_SUBSCRIPTION:
      return {
        ...state,
        loading: true
      };
    case SubscriptionActionTypes.DELETE_SUBSCRIPTION_SUCCESS:
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'You delete Success',
        showConfirmButton: false,
        timer: 1500
      })
    console.log(action.type,"/"+ action.payload);
      return {
        ...state,
        list: state.list.filter(item => item.company.id !== action.payload),
        loading: false
      }
    case SubscriptionActionTypes.DELETE_SUBSCRIPTION_FAILURE:
      console.log(action.type, action.payload);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'You delete FAIL',
        showConfirmButton: false,
        timer: 1500
      })
      return {
        ...state,
        error: action.payload,
        loading: true
      };
      case SubscriptionActionTypes.ADD_SUBSCRIPTION:
      return {
        ...state,
        loading: true
      }
    case SubscriptionActionTypes.ADD_SUBSCRIPTION_SUCCESS:
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'You Add Success',
        showConfirmButton: false,
        timer: 1500
      })
      return {
        ...state,
        list: [...state.list, action.payload],
        loading: false
      };
    case SubscriptionActionTypes.ADD_SUBSCRIPTION_FAILURE:
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'You Add Fail',
        showConfirmButton: false,
        timer: 1500
      })
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      case SubscriptionActionTypes.UPDATE_SUBSCRIPTION:
        return {
          ...state,
          loading: true
        }
      case SubscriptionActionTypes.UPDATE_SUBSCRIPTION_SUCCESS:
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You Update Success',
          showConfirmButton: false,
          timer: 1500
        })
        console.log(action.payload.company_id);
        return {
          ...state,
          list: state.list.map((value,key) => {
            console.log("lần " + value.company.id);
            if(value.company.id == action.payload.company_id){
              value[key] = action.payload;
            }
          }),
          loading: false
        };
      case SubscriptionActionTypes.UPDATE_SUBSCRIPTION_FAILURE:
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'You Update Fail',
          showConfirmButton: false,
          timer: 1500
        })
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      default:
        return state;
    }
  }
