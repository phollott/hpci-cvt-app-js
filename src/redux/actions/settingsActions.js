import { SET_LANGUAGE, SET_IS_ONLINE, SET_NOTIFICATIONS } from './actionTypes';

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

export function setNotifications(notifications) {
  return {
    type: SET_NOTIFICATIONS,
    payload: {
      notifications: {
        enabled: notifications.enabled,
        newProducts: notifications.newProducts,
        bookmarkedProducts: notifications.bookmarkedProducts
      }
    }
  };
}
