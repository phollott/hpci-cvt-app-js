import { SET_LANGUAGE, SET_IS_ONLINE } from './actionTypes';

export function setLanguage(lang) {
  return {
    type: SET_LANGUAGE,
    payload: { language: lang }
  };
}

export function setIsOnline(online) {
  return {
    type: SET_IS_ONLINE,
    payload: { isOnline: online }
  };
}
