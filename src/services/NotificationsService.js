import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import StorageService from './StorageService';

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
    await StorageService.save(
      'expoPushToken',
      typeof token !== 'undefined' ? token : ''
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Unable to save expoPushToken to storage. ', error);
  }
}

// TODO: store token on backend, notification settings?
async function registerForPushNotificationsAsync() {
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
      // eslint-disable-next-line no-console
      console.log('Failed to get push token for push notification!');
      return '';
    }
    // expo managed (would need to provide experience ID if bare)
    // token = (await Notifications.getExpoPushTokenAsync()).data;
    const experienceId = '@hpci-cvt/hpci-cvt-app-js';
    token = (await Notifications.getExpoPushTokenAsync(experienceId)).data;
    // eslint-disable-next-line no-console
    console.log('Received Expo push token: ', token);
  } else {
    // eslint-disable-next-line no-console
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

async function sendExpoPushNotification(message) {
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
    // eslint-disable-next-line no-console
    console.log('Unable to send Expo Push Notification. ', error);
  }
}

export default {
  retrieveExpoPushToken,
  saveExpoPushToken,
  registerForPushNotificationsAsync,
  sendExpoPushNotification
};
