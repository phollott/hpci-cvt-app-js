import { SET_LANGUAGE, SET_IS_ONLINE } from '../actions/actionTypes';
import { lang } from '../../constants/constants';

const initialState = {
  settings : {
    language : lang.default,
    isOnline : true
  }
};

const settingsReducer = (state = initialState, action) => {
  // get current state
  switch(action.type) {
    case SET_LANGUAGE: {
      const settingsNode = { ...state };
      settingsNode.language = action.payload.language;
      return { ...state, ...settingsNode };
    }
    case SET_IS_ONLINE: {
      const settingsNode = { ...state };
      settingsNode.isOnline = action.payload.isOnline;
      return { ...state, ...settingsNode };
    }
    default:
      return state;
  }
};

export default settingsReducer;
