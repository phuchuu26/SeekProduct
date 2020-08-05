import { UsersAction, UsersActionTypes } from '../actions/users.actions';
import { Users } from '../models/users.model';
import Swal from 'sweetalert2'
export interface UsersState {
    list: Users[],
    loading: boolean,
    error: Error;
  }
  const initialState: UsersState = {
    list: [],
    loading: false,
    error: undefined
  };
  export function UsersReducer(state: UsersState = initialState, action: UsersAction) {
    switch (action.type) {
      case UsersActionTypes.LOAD_USERS:
        return {
          ...state,
          loading: true
        }
      case UsersActionTypes.LOAD_USERS_SUCCESS:
        return {
          ...state,
          list: action.payload,
          loading: false
        }
      case UsersActionTypes.LOAD_USERS_FAILURE:
        return {
          ...state,
          error: action.payload
        }
        case UsersActionTypes.DELETE_USERS:
      return {
        ...state,
        loading: true
      };
    case UsersActionTypes.DELETE_USERS_SUCCESS:
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'You delete Success',
        showConfirmButton: false,
        timer: 1500
      })
      return {
        ...state,
        list: state.list.filter(item => item.id !== action.payload),
        loading: false
      }
    case UsersActionTypes.DELETE_USERS_FAILURE:
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
      case UsersActionTypes.ADD_USERS:
      return {
        ...state,
        loading: true
      }
    case UsersActionTypes.ADD_USERS_SUCCESS:
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
    case UsersActionTypes.ADD_USERS_FAILURE:
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
      case UsersActionTypes.UPDATE_USERS:
        return {
          ...state,
          loading: true
        }
      case UsersActionTypes.UPDATE_USERS_SUCCESS:
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You Update Success',
          showConfirmButton: false,
          timer: 1500
        })
        return {
          ...state,
          list: state.list.map(item => item.id === action.payload.id ? action.payload : item),
          loading: false
        };
      case UsersActionTypes.UPDATE_USERS_FAILURE:
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
