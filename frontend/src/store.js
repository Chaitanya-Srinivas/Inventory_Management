// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/RootReducer'; // assuming you have a file named 'reducers.js' where you combine reducers

const store = configureStore({
    reducer: rootReducer, // Pass the combined reducers here
});

export default store;
