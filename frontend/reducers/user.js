import { 
  SAVE_USER_SUCCESS,
  SAVE_USER_ERROR, 
  DISMISS_USER_ERROR, 
  DISMISS_USER_SUCCESS, 
  SET_USER_PARAMS, 
  SEND_LOCAL_CREDENTIALS } from '../constants/ActionTypes';

const initialState = {
  _id: null,
  name: 'Unknown',
  errors: null,
  success: false
};

export default function user(state = initialState, action) {
  switch (action.type) {
    // case SET_USER_TIMEFRAME:
    //   return { ...state, timeframe: action.timeframe, intervalFrom: action.intervalFrom, intervalTo:action.intervalTo }
    case SAVE_USER_SUCCESS:
      return { ...state, errors: null, success: true, ...action.response };
    case SAVE_USER_ERROR:
      return { ...state, errors: action.error };
    case DISMISS_USER_ERROR:
      return { ...state, errors: null };
    case DISMISS_USER_SUCCESS:
      return { ...state, success: false };
    case SET_USER_PARAMS:
      //return { ...state, tableParams: action.params }
      return { ...state};
    case SEND_LOCAL_CREDENTIALS:
      return { ...state, errors: null, success: false };
    default:
      return state;
  }
}