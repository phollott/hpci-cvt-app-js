/* eslint-disable no-console */
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { EventRegister } from 'react-native-event-listeners';
import LanguageStorageService from './LanguageStorageService';
import SettingsStorageService from './SettingsStorageService';
import StorageService from './StorageService';
import {
  registerDevice,
  unregisterDevice,
  dispatchDevicePreferences,
  fetchNotificationsAsync
} from '../api/pushNotificationService';
import {
  expoPushNotificationKeyPrefix,
  expoPushTokenKeyPrefix,
  lang
} from '../constants/constants';
import * as RootNavigation from '../navigation/RootNavigation';
import { isNil } from '../shared/util';
import { getTimeInMillis } from '../shared/date-fns';

const NOTIFICATION_RECEIVED = 'notificationReceived'; // while app in foreground
const NOTIFICATION_RESPONSE_RECEIVED = 'notificationResponseReceived'; // while app in foreground, background or closed
const NOTIFICATION_SERVICE_SYNC = 'notificationServiceSync'; // when language pref changes

// notificationEvent emitted by: handleNotification, deleteNotification, setViewed

const pushNotification = (notification) => {
  if (notification) {
    if (notification.request) {
      // expo
      return {
        id: notification.request.identifier,
        date: notification.date, // in millis
        body: notification.request.content.body, // message
        data: { ...notification.request.content.data }, // ex: {} ; {"messageType": "productUpdate", "products": "16"} ; {"messageType": "productUpdate", "products": ["16", "18", "20"]} ; {"messageType": "newProduct"} ; {"link": "https:..."}
        title: notification.request.content.title,
        viewed: null, // in millis
        isRemoved: false
      };
    }
    if (notification.data) {
      // pns
      const createdTime = new Date(notification.created).getTime();
      return {
        id: ''.concat(createdTime).concat(Math.random()),
        date: createdTime, // in millis
        body: notification.body, // message
        data: { ...notification.data }, // ex: {}, {"messageType": "productUpdate", "products": "16"} ; {"messageType": "productUpdate", "products": ["16", "18", "20"]} ; {"messageType": "newProduct"} ; {"link": "https:..."}
        title: notification.title,
        viewed: createdTime, // in millis
        isRemoved: false
      };
    }
  }
  return {};
};

const devicePrefs = (
  language = lang.english,
  bookmarks = null,
  notifications = null
) => {
  return {
    data: {
      language: language === lang.english ? lang.english : lang.french, // "en" or "fr"
      bookmarks, // ex: null, ["15", "16"]
      notifications // ex: { enabled: true, newProducts: true, bookmarkedProducts: true }
    }
  };
};

const messageType = {
  general: 'general',
  productUpdate: 'productUpdate',
  newProduct: 'newProduct'
};

function isProductSpecific(notification) {
  const { data } = notification;
  let hasNid = false;
  if (
    (notification.data.messageType === messageType.productUpdate ||
      notification.data.messageType === messageType.newProduct) &&
    !isNil(data.products) &&
    (Number.isInteger(parseInt(data.products, 10)) ||
      (Array.isArray(data.products) && notification.data.products.length > 0))
  ) {
    hasNid = true;
  }
  return hasNid;
}

function getExternalLink(notification) {
  const { data } = notification;
  let link = '';
  if (
    !isNil(data.link) &&
    data.link.length > 10 &&
    (data.link.toLowerCase().startsWith('https://') ||
      data.link.toLowerCase().startsWith('http://'))
  ) {
    link = data.link;
  }
  return link;
}

async function saveExpoPushNotification(notification) {
  try {
    const key = expoPushNotificationKeyPrefix.concat(notification.id);
    const storedPn = await StorageService.retrieve(key);
    if (storedPn) {
      // console.log('Expo push notification already saved: ', key);
      return false;
    }
    // TODO: max limit?
    await StorageService.save(
      expoPushNotificationKeyPrefix.concat(notification.id),
      JSON.stringify(notification)
    );
  } catch (error) {
    console.log('Unable to save Expo Push Notification to storage. ', error);
    return false;
  }
  return true;
}

function handleNotificationReceived(notification) {
  handleNotification(notification, NOTIFICATION_RECEIVED);
}

function handleNotificationResponseReceived(response) {
  RootNavigation.navigate('HomeStack', {
    screen: 'Notifications'
  }).then((isMounted) => {
    if (isMounted) {
      setTimeout(() => {
        handleNotification(
          response.notification,
          NOTIFICATION_RESPONSE_RECEIVED
        );
      }, 1000);
    }
  });
}

async function handleNotification(notification, source) {
  // console.log('handleNotification notification: ', notification);
  // console.log('handleNotification source: ', source);
  const pn = pushNotification(notification);
  if (pn && pn.id && pn.body && pn.body.length > 0) {
    // console.log('handleNotification pn: ', pn);
    saveExpoPushNotification(pn).then((saved) => {
      if (saved) {
        EventRegister.emit('notificationEvent', pn);
      }
    });
  }
}

function registerNotificationHandler() {
  try {
    // https://docs.expo.io/push-notifications/receiving-notifications/

    // set notification handler for when app is foregrounded
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false
        };
      }
    });

    // fired whenever a notification is received while the app is foregrounded
    Notifications.addNotificationReceivedListener(handleNotificationReceived);

    // fired whenever a user taps on or interacts with a notification
    // note: this is supposed to work when app is foregrounded, backgrounded, or closed/killed
    //       ios only opens expo go when app and expo go are closed, so app does not handle notification message
    //         see: https://github.com/expo/expo/tree/master/packages/expo-notifications#handling-incoming-notifications-when-the-app-is-not-in-the-foreground-not-supported-in-expo-go
    // TODO: configure and implement for ios and android without expo go
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponseReceived
    );
  } catch (e) {
    console.log('Error in registerNotificationHandler: ', e);
  }
}

async function registerForPushNotificationsAsync() {
  // https://docs.expo.io/push-notifications/push-notifications-setup/
  let token = '';
  if (Constants.isDevice) {
    const {
      status: existingStatus
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      // request permissions if notifications are enabled (e.g. after install or enabled by user)
      const {
        enabled
      } = await SettingsStorageService.retrieveNotificationsSettings();
      if (enabled) {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
    }
    if (finalStatus !== 'granted') {
      // android users do not get prompted (permissions are enabled by default, so user will need to re-enable)
      // Note: device will be unregistered from push notification service during registerDeviceToken when token = ''
      console.log('Failed to get push token for push notification!');
      return '';
    }
    // expo managed (would need to provide experience ID if bare)
    // token = (await Notifications.getExpoPushTokenAsync()).data;
    const experienceId = '@hpci-cvt/hpci-cvt-app-js';
    token = (await Notifications.getExpoPushTokenAsync(experienceId)).data;
    // console.log('Received Expo push token: ', token);
  } else {
    console.log('Must use physical device for Push Notifications.');
  }
  // need to specify a channel if android, see expo-notifications documentation
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    });
  }
  return token;
}

async function retrieveExpoPushToken() {
  let value = '';
  try {
    value = await StorageService.retrieve(expoPushTokenKeyPrefix);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Unable to retrieve expoPushToken. ', error);
  }
  return value;
}

async function saveExpoPushToken(token) {
  try {
    await StorageService.save(
      expoPushTokenKeyPrefix,
      !isNil(token) ? token : ''
    );
  } catch (error) {
    console.log('Unable to save expoPushToken to storage. ', error);
  }
}

function getTokenID(token) {
  // token ID is the text between []
  return token.match(/\[(.*?)\]/i)[1];
}

async function registerDeviceToken(token, locale, bookmarks = null) {
  try {
    if (token !== '') {
      // register
      const langPref = await LanguageStorageService.retrieveLanguage();
      const language =
        !isNil(langPref) &&
        (langPref === lang.english || langPref === lang.french)
          ? langPref
          : locale;
      const settings = await SettingsStorageService.retrieveNotificationsSettings();
      const data = devicePrefs(language, bookmarks, settings);
      registerDevice(getTokenID(token), language, data);
      saveExpoPushToken(token);
    } else {
      // unregister
      SettingsStorageService.saveDisabledNotificationsSettings();
      const storedToken = await retrieveExpoPushToken();
      if (storedToken !== '') {
        // e.g. user has disabled
        unregisterDevice(getTokenID(storedToken));
        saveExpoPushToken('');
      }
    }
  } catch (error) {
    console.log(
      'Unable to '
        .concat(token !== '' ? 'register with' : 'unregister from')
        .concat(' the push notification service. '),
      error
    );
  }
}

async function retrieveNotifications() {
  let keys = [];
  let storedNotifications = [];
  const notifications = [];
  try {
    keys = await StorageService.retrieveKeys();
    if (keys.length > 0) {
      keys = keys.filter((key) => {
        return key.startsWith(expoPushNotificationKeyPrefix);
      });
      storedNotifications =
        keys !== null ? await StorageService.retrieveMulti(keys) : [];
      if (storedNotifications.length > 0) {
        storedNotifications.forEach((notification) => {
          notifications.push(JSON.parse(notification[1]));
        });
      }
    }
  } catch (error) {
    console.log('retrieveNotifications error: ', error);
  }
  return notifications;
}

async function deleteNotification(inNotification) {
  const { id } = inNotification;
  const notification = JSON.parse(JSON.stringify(inNotification));
  try {
    StorageService.delete(expoPushNotificationKeyPrefix.concat(id)).then(() => {
      notification.isRemoved = true;
      EventRegister.emit('notificationEvent', notification);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      'Unable to delete notification '
        .concat(expoPushNotificationKeyPrefix)
        .concat(id)
        .concat(' from storage. '),
      error
    );
  }
}

async function setViewed(inNotification) {
  const { id } = inNotification;
  const notification = JSON.parse(JSON.stringify(inNotification));
  notification.viewed = getTimeInMillis();
  try {
    StorageService.save(
      expoPushNotificationKeyPrefix.concat(id),
      JSON.stringify(notification)
    ).then(() => {
      EventRegister.emit('notificationEvent', notification);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      'Unable to update stored notification '
        .concat(expoPushNotificationKeyPrefix)
        .concat(id)
        .concat(' viewed. '),
      error
    );
  }
  return notification;
}

async function isAnyNotificationNotViewed() {
  const notifications = await retrieveNotifications();
  return notifications.some((notification) => {
    return isNil(notification.viewed) && notification.isRemoved === false;
  });
}

async function dispatchPreferences(language, bookmarks = null) {
  try {
    const token = await retrieveExpoPushToken();
    if (token !== '') {
      const settings = await SettingsStorageService.retrieveNotificationsSettings();
      const data = devicePrefs(language, bookmarks, settings);
      await dispatchDevicePreferences(getTokenID(token), data);
    }
  } catch (error) {
    console.log(
      'Unable to dispatch device preferences to push notification service. ',
      error
    );
  }
}

async function dispatchPreferencesAndSync(language) {
  try {
    const token = await retrieveExpoPushToken();
    if (token !== '') {
      await dispatchPreferences(language);
      const storedNotifications = await retrieveNotifications();
      if (storedNotifications.length > 0) {
        // fetch latest (in language)
        const latestNotifications = await fetchNotificationsAsync(
          getTokenID(token)
        );
        // delete all notifications
        storedNotifications.forEach((notification) => {
          deleteNotification(notification);
        });
        // save fetched notifications
        latestNotifications.forEach((notification) => {
          handleNotification(notification, NOTIFICATION_SERVICE_SYNC);
        });
      }
    }
  } catch (error) {
    console.log(
      'Unable to sync after dispatching device preferences to push notification service. ',
      error
    );
  }
}

export default {
  registerNotificationHandler,
  registerForPushNotificationsAsync,
  retrieveExpoPushToken,
  registerDeviceToken,
  retrieveNotifications,
  deleteNotification,
  setViewed,
  isAnyNotificationNotViewed,
  messageType,
  isProductSpecific,
  getExternalLink,
  dispatchPreferences,
  dispatchPreferencesAndSync
};
