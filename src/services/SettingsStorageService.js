/* eslint-disable no-console */
import StorageService from './StorageService';
import { lang, notificationsSettingsKeyPrefix } from '../constants/constants';
import { isNil, isObjectEmpty } from '../shared/util';

const defaultSettings = () => {
  return {
    language: lang.default,
    isOnline: true,
    notifications: {
      enabled: true,
      newProducts: true,
      bookmarkedProducts: true
    }
  };
};

const notificationsSettings = (settings) => {
  if (settings) {
    return {
      enabled: toBool(settings.enabled),
      newProducts: toBool(settings.newProducts),
      bookmarkedProducts: toBool(settings.bookmarkedProducts)
    };
  }
  const { notifications: defaults } = defaultSettings();
  return defaults;
};

const toBool = (setting) => {
  return !isNil(setting) && setting === true;
};

const disabledNotificationsSettings = () => {
  return notificationsSettings({
    enabled: false,
    newProducts: false,
    bookmarkedProducts: false
  });
};

const retrieveNotificationsSettings = async () => {
  let storedSettings;
  let settings = {};
  try {
    storedSettings = await StorageService.retrieve(
      notificationsSettingsKeyPrefix
    );
    if (!isNil(storedSettings)) {
      settings = notificationsSettings(JSON.parse(storedSettings));
    }
  } catch (error) {
    console.log('Unable to retrieve notifications settings. ', error);
  }
  if (!isObjectEmpty(settings)) {
    return settings;
  }
  const { notifications: defaults } = defaultSettings();
  return defaults;
};

const saveNotificationsSettings = async (settings) => {
  try {
    await StorageService.save(
      notificationsSettingsKeyPrefix,
      JSON.stringify(notificationsSettings(settings))
    );
  } catch (error) {
    console.log('Unable to save notifications settings to storage. ', error);
  }
};

const saveDisabledNotificationsSettings = async () => {
  saveNotificationsSettings(disabledNotificationsSettings());
};

export default {
  defaultSettings,
  disabledNotificationsSettings,
  retrieveNotificationsSettings,
  saveNotificationsSettings,
  saveDisabledNotificationsSettings
};
