import { combineReducers } from 'redux';
 // Import action types

const initialState = {
  token: null,
  userId: null,
  tokenExpiration: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        tokenExpiration: action.tokenExpiration
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        userId: null,
        tokenExpiration: null
      };
    default:
      return state;
  }
};

// export default combineReducers({
//   auth: authReducer
// });

export default authReducer
