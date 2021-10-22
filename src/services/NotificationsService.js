/* eslint-disable no-console */
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { EventRegister } from 'react-native-event-listeners';
import StorageService from './StorageService';
import { isNil } from '../shared/util';
import { getTimeInMillis } from '../shared/date-fns';

const NOTIFICATION_RECEIVED = 'notificationReceived'; // while app in foreground
const NOTIFICATION_RESPONSE_RECEIVED = 'notificationResponseReceived'; // while app in foreground, background or closed

const PERSIST_NOTIFICATION_ENABLED = true; // must be true, can disable for testing

const PERSIST_NOTIFICATION_KEY_PREFIX = 'expoPushNotification-';

const pushNotification = (notification) => {
  if (notification && notification.request) {
    return {
      id: notification.request.identifier,
      date: notification.date, // in millis
      body: notification.request.content.body, // message
      data: { ...notification.request.content.data }, // ex: {}, {"nid": 16}, {"nid": [16, 18, 20]}, {"link": "https:..."}, both
      title: notification.request.content.title,
      viewed: null, // in millis
      isRemoved: false
    };
  }
  return {};
};

// notificationEvent emitted by: handleNotification, deleteNotification, setViewed

const isProductSpecific = (notification) => {
  const { data } = notification;
  let hasNid = false;
  if (
    !isNil(data.nid) &&
    ((Number.isInteger(data.nid) && data.nid > 0) ||
      (Array.isArray(data.nid) && notification.data.nid.length > 0))
  ) {
    hasNid = true;
  }
  return hasNid;
};

const getExternalLink = (notification) => {
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
};

async function saveExpoPushNotification(notification) {
  try {
    const key = PERSIST_NOTIFICATION_KEY_PREFIX.concat(notification.id);
    const storedPn = await StorageService.retrieve(key);
    if (storedPn) {
      // console.log('Expo push notification already saved: ', key);
      return false;
    }
    // TODO: max limit?
    await StorageService.save(
      PERSIST_NOTIFICATION_KEY_PREFIX.concat(notification.id),
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
  handleNotification(response.notification, NOTIFICATION_RESPONSE_RECEIVED);
}

async function handleNotification(notification, source) {
  // console.log('handleNotification notification: ', notification);
  // console.log('handleNotification source: ', source);
  const pn = pushNotification(notification);
  if (pn && pn.id && pn.body && pn.body.length > 0) {
    // console.log('handleNotification pn: ', pn);
    if (PERSIST_NOTIFICATION_ENABLED) {
      saveExpoPushNotification(pn).then((saved) => {
        if (saved) {
          EventRegister.emit('notificationEvent', pn);
        }
      });
    }
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
    // TODO: backend for notifications, credentials, configure and implement for ios and android without expo go
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponseReceived
    );
  } catch (e) {
    console.log('Error in registerNotificationHandler: ', e);
  }
}

// TODO: store token on backend, notification settings?
async function registerForPushNotificationsAsync() {
  // https://docs.expo.io/push-notifications/push-notifications-setup/
  let token = '';
  if (Constants.isDevice) {
    const {
      status: existingStatus
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // android users do not get prompted (permissions are enabled by default, so user will need to re-enable)
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
  let value;
  try {
    value = await StorageService.retrieve('expoPushToken');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Unable to retrieve expoPushToken. ', error);
  }
  return value;
}

async function saveExpoPushToken(token) {
  try {
    await StorageService.save('expoPushToken', !isNil(token) ? token : '');
  } catch (error) {
    console.log('Unable to save expoPushToken to storage. ', error);
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
        return key.startsWith(PERSIST_NOTIFICATION_KEY_PREFIX);
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
    StorageService.delete(PERSIST_NOTIFICATION_KEY_PREFIX.concat(id)).then(
      () => {
        notification.isRemoved = true;
        EventRegister.emit('notificationEvent', notification);
      }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      'Unable to delete notification '
        .concat(PERSIST_NOTIFICATION_KEY_PREFIX)
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
      PERSIST_NOTIFICATION_KEY_PREFIX.concat(id),
      JSON.stringify(notification)
    ).then(() => {
      EventRegister.emit('notificationEvent', notification);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      'Unable to update stored notification '
        .concat(PERSIST_NOTIFICATION_KEY_PREFIX)
        .concat(id)
        .concat(' viewed. '),
      error
    );
  }
  return notification;
}

// can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
// TODO: backend - https://docs.expo.io/push-notifications/sending-notifications/
async function sendExpoPushNotification(message) {
  // https://docs.expo.io/push-notifications/overview/
  try {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
  } catch (error) {
    console.log('Unable to send Expo Push Notification. ', error);
  }
}

export default {
  registerNotificationHandler,
  registerForPushNotificationsAsync,
  retrieveExpoPushToken,
  saveExpoPushToken,
  retrieveNotifications,
  deleteNotification,
  setViewed,
  isProductSpecific,
  getExternalLink,
  sendExpoPushNotification
};
