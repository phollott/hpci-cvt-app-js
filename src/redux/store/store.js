import { combineReducers } from 'redux';
import productReducer from '../reducers/productReducer.js';
import settingsReducer from '../reducers/settingsReducer.js';

// create root reducer, the keys determine what part of the state object each reducer manages
const rootReducer = combineReducers({
  products : productReducer,
  settings : settingsReducer
});

export default rootReducer;
