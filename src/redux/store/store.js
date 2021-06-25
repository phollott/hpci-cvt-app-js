import { combineReducers } from 'redux';
import bookmarkReducer from '../reducers/bookmarkReducer';
import productReducer from '../reducers/productReducer';
import settingsReducer from '../reducers/settingsReducer';

// create root reducer, the keys determine what part of the state object each reducer manages
const rootReducer = combineReducers({
  bookmarks: bookmarkReducer,
  products: productReducer,
  settings: settingsReducer
});

export default rootReducer;
