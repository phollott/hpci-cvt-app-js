import { PNS_API_URL_SEND } from 'react-native-dotenv';
import { devicesAPIUrl, notificationsAPIUrl } from '../config/routes';
import { isNil } from '../shared/util';

// TODO: ensure dev only, send is only used by Push Notifcations Screen Dev Tool
const sendNotificationsAPIUrl = PNS_API_URL_SEND;

// eslint-disable-next-line no-undef
const headers = new Headers();
headers.append('Accept', 'application/json');
headers.append('Content-Type', 'application/json');
headers.append('Pragma', 'no-cache');
headers.append('Cache-Control', 'no-cache');

const registerDevice = async (token, languagePref) => {
  try {
    const requestInit = {
      method: 'POST',
      headers
    };
    const response = await fetch(
      devicesAPIUrl.concat('/').concat(token).concat('.').concat(languagePref),
      requestInit
    );
    const responseText = await response.text();
    if (response.status !== 200) {
      throw Error(responseText.message);
    }
    return responseText;
  } catch (error) {
    throw Error(error.message);
  }
};

const unregisterDevice = async (token) => {
  try {
    const requestInit = {
      method: 'DELETE',
      headers
    };
    const response = await fetch(
      devicesAPIUrl.concat('/').concat(token),
      requestInit
    );
    const responseText = await response.text();
    if (response.status !== 200) {
      throw Error(responseText.message);
    }
    return responseText;
  } catch (error) {
    throw Error(error.message);
  }
};

const dispatchDevicePreferences = async (token, data) => {
  try {
    const requestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    };
    const response = await fetch(
      devicesAPIUrl.concat('/').concat(token),
      requestInit
    );
    const responseText = await response.text();
    if (response.status !== 200) {
      throw Error(responseText.message);
    }
    return responseText;
  } catch (error) {
    throw Error(error.message);
  }
};

const fetchNotificationsAsync = async (token) => {
  try {
    const requestInit = {
      method: 'GET',
      headers
    };
    const response = await fetch(
      notificationsAPIUrl.concat('/').concat(token),
      requestInit
    );
    if (response.status === 200) {
      return await response.json();
    }
    if (response.status === 404) {
      return [];
    }
    throw Error('Unexpected response.');
  } catch (error) {
    throw Error(error.message);
  }
};

const sendPushNotification = async (message) => {
  try {
    const requestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(message)
    };
    fetch(sendNotificationsAPIUrl, requestInit);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      'Unable to send push notification. ',
      !isNil(error.message) ? error.message : ''
    );
  }
};

export {
  registerDevice,
  unregisterDevice,
  dispatchDevicePreferences,
  fetchNotificationsAsync,
  sendPushNotification
};
