import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Platform, ScrollView, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'i18n-js';
import * as I18n from '../config/i18n';
import { gStyle } from '../constants';
import Alert from '../components/Alert';
import ViewCardText from '../components/ViewCardText';
import ViewSwitch from '../components/ViewSwitch';
import { setNotifications } from '../redux/actions/settingsActions';
import { selectBookmarkIDs } from '../redux/selectors/bookmarkSelector';
import { notifications, settingsStorage } from '../services';

const NotificationsSettingsScreen = ({ navigation }) => {
  const theme = useTheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const notificationsSettingsViewKey = language.concat(
    'NotificationsSettingsView'
  );

  const bookmarkIDs = useSelector((state) => {
    return selectBookmarkIDs(state);
  });

  const notificationsSettings = useSelector(
    (state) => state.settings.notifications
  );

  const dispatch = useDispatch();
  const setNotificationsSettings = (value) => dispatch(setNotifications(value));

  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    notifications.retrieveExpoPushToken().then((token) => {
      setExpoPushToken(token);
      setIsNotificationsSwitchOn(notificationsSettings.enabled);
      setSubsettingsSwitches(
        notificationsSettings.newProducts,
        notificationsSettings.bookmarkedProducts
      );
    });
  }, []);

  const [isNotificationsSwitchOn, setIsNotificationsSwitchOn] = useState(
    notificationsSettings.enabled
  );

  const [isNewProductsSwitchOn, setIsNewProductsSwitchOn] = useState(
    notificationsSettings.newProducts
  );

  const [isBookmarkedProductsSwitchOn, setIsBookmarkedProductsSwitchOn] =
    useState(notificationsSettings.bookmarkedProducts);

  const setSubsettingsSwitches = (
    newProducts = true,
    bookmarkedProducts = true
  ) => {
    setIsNewProductsSwitchOn(newProducts);
    setIsBookmarkedProductsSwitchOn(bookmarkedProducts);
  };

  const { notifications: defaults } = settingsStorage.defaultSettings();

  const onToggleNotificationsSwitch = async () => {
    const switchWasOn = isNotificationsSwitchOn;
    setIsNotificationsSwitchOn(!isNotificationsSwitchOn);
    if (switchWasOn) {
      // switched off, unregister
      // note: registerDeviceToken will unregister device from push notification service when expoPushToken is ''
      await notifications.registerDeviceToken('', I18n.getCurrentLocale());
      setExpoPushToken('');
      setSubsettingsSwitches(false, false);
      setNotificationsSettings(settingsStorage.disabledNotificationsSettings());
    } else {
      // switched on, register
      // note: if device notifications for the app are not allowed,
      //       may prompt ios users for permission, but alert android users to enable device notifications for app
      await settingsStorage.saveNotificationsSettings(defaults);
      setSubsettingsSwitches();
      notifications.registerForPushNotificationsAsync().then((token) => {
        if (token === '') {
          setIsNotificationsSwitchOn(false);
          setSubsettingsSwitches(false, false);
          if (Platform.OS === 'android') {
            Alert(t('home.settings.notifications.message.allowNotifications'));
          }
        }
        notifications
          .registerDeviceToken(token, I18n.getCurrentLocale(), bookmarkIDs)
          .then(() => {
            if (token === '') {
              setNotificationsSettings(
                settingsStorage.disabledNotificationsSettings()
              );
            } else {
              setNotificationsSettings(defaults);
            }
          });
      });
    }
  };

  const saveAndDispatchSettings = async (settings) => {
    await settingsStorage.saveNotificationsSettings(settings);
    notifications
      .dispatchPreferences(
        language,
        settings.bookmarkedProducts ? bookmarkIDs : []
      )
      .then(() => {
        setNotificationsSettings(settings);
      });
  };

  const onToggleNewProductsSwitch = async () => {
    const switchWasOn = isNewProductsSwitchOn;
    setIsNewProductsSwitchOn(!isNewProductsSwitchOn);
    const settings = {
      enabled: notificationsSettings.enabled,
      newProducts: !switchWasOn,
      bookmarkedProducts: notificationsSettings.bookmarkedProducts
    };
    await saveAndDispatchSettings(settings);
  };

  const onToggleBookmarkedProductsSwitch = async () => {
    const switchWasOn = isBookmarkedProductsSwitchOn;
    setIsBookmarkedProductsSwitchOn(!isBookmarkedProductsSwitchOn);
    const settings = {
      enabled: notificationsSettings.enabled,
      newProducts: notificationsSettings.newProducts,
      bookmarkedProducts: !switchWasOn
    };
    await saveAndDispatchSettings(settings);
  };

  return (
    <View style={gStyle.container[theme]} key={notificationsSettingsViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <ViewCardText
          title={t('home.settings.notifications.title')}
          text={t('home.settings.notifications.instructionText')}
        />
        <View style={gStyle.spacer32} />
        <ViewSwitch
          text={t('home.settings.notifications.switch.notificationsLabel')}
          value={isNotificationsSwitchOn}
          onValueChange={onToggleNotificationsSwitch}
        />
        <View style={gStyle.spacer48} />
        {isNotificationsSwitchOn && (
          <>
            <ViewSwitch
              text={t('home.settings.notifications.switch.newProductsLabel')}
              value={isNewProductsSwitchOn}
              onValueChange={onToggleNewProductsSwitch}
            />
            <View style={{ width: '90%', textAlign: 'left' }}>
              <Text style={{ width: '80%' }}>
                {t('home.settings.notifications.switch.newProductsText')}
              </Text>
            </View>
            <View style={gStyle.spacer32} />
            <ViewSwitch
              text={t(
                'home.settings.notifications.switch.bookmarkedProductsLabel'
              )}
              value={isBookmarkedProductsSwitchOn}
              onValueChange={onToggleBookmarkedProductsSwitch}
            />
            <View style={{ width: '90%', textAlign: 'left' }}>
              <Text style={{ width: '80%' }}>
                {t('home.settings.notifications.switch.bookmarkedProductsText')}
              </Text>
            </View>
          </>
        )}
        <View style={gStyle.spacer32} />
      </ScrollView>
    </View>
  );
};

NotificationsSettingsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default NotificationsSettingsScreen;
