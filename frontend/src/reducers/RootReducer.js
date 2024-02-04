// reducers.js
import { combineReducers } from 'redux';
import authReducer from './AuthReducer'; // adjust the path if necessary

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers if you have any
});

export default rootReducer;
