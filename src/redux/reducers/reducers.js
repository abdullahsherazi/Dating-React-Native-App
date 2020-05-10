import * as actionTypes from '../actions/types';

const initialState = {
  loading: false,
  userdata: {},
  partners: [],
  call: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.NOT_LOADING:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.SET_USER_DATA:
      console.log('USERDATA', action.payload);
      return {
        ...state,
        userdata: action.payload,
      };
    case actionTypes.SET_PARTNERS:
      console.log('PARTNERS', action.payload);
      return {
        ...state,
        partners: action.payload,
      };
    case actionTypes.SET_CALL_STATUS:
      console.log('CALL STATUS', action.payload);
      return {
        ...state,
        call: action.payload,
      };
    default:
      return state;
  }
}
