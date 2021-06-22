import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View, Linking } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import Touch from '../components/Touch';
import ViewCardText from '../components/ViewCardText';
import { storage } from '../services';

// dev tool

const retrieveExpoPushToken = async () => {
  let value;
  try {
    value = await storage.retrieve('expoPushToken');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Unable to retrieve expoPushToken. ', error);
  }
  return value;
}

const PushNotificationScreen = ({ navigation, route }) => {
  const theme = useTheme();

  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    retrieveExpoPushToken().then((token) => setExpoPushToken(token));
  });

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  let pushNotificationViewKey = language.concat('PushNotificationView');

  let notification;
  // check for notification and concat notification action so screen rerenders when notification is received
  if (
    typeof route.params !== 'undefined' &&
    typeof route.params.pushNotification !== 'undefined'
  ) {
    notification = JSON.parse(route.params.pushNotification);
    pushNotificationViewKey = pushNotificationViewKey.concat(
      route.params.pushNotificationAction
    );
  }

  return (
    <View style={gStyle.container[theme]} key={pushNotificationViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <ViewCardText
          title={t('home.pushNotification.card.title')}
          text={t('home.pushNotification.card.instructionText')}
        />
        <View style={gStyle.spacer16} />
        <View style={{ width: '90%', justifyContent: 'center' }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-around'
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {t('home.pushNotification.notification.heading')}
            </Text>
            <View style={gStyle.spacer8} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text>
                {t('home.pushNotification.notification.title').concat(': ')}
                {notification && notification.request.content.title}
              </Text>
              <Text>
                {t('home.pushNotification.notification.body').concat(': ')}
                {notification && notification.request.content.body}
              </Text>
              <Text>
                {t('home.pushNotification.notification.data').concat(': ')}
                {notification &&
                  JSON.stringify(notification.request.content.data)}
              </Text>
            </View>
            <View style={gStyle.spacer16} />
            <View style={{ width: '100%', justifyContent: 'center' }}>
              <Touch
                onPress={async () => {
                  await sendPushNotification();
                }}
                text={t('home.pushNotification.button.sendTitle')}
                lIconName="share"
              />
            </View>
            <View style={gStyle.spacer16} />
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Expo Push Token</Text>
            <View style={gStyle.spacer8} />
            <Text
              selectable
              style={(gStyle.text[theme], { fontSize: 14, fontWeight: 'bold' })}
            >
              {expoPushToken}
            </Text>
            <View style={gStyle.spacer16} />
            <View style={{ width: '100%', justifyContent: 'center' }}>
              <Touch
                onPress={() => {
                  const epntUrl = 'https:expo.io/notifications';
                  Linking.canOpenURL(epntUrl).then((supported) => {
                    if (supported) {
                      Linking.openURL(epntUrl);
                    }
                  });
                }}
                text={t('home.pushNotification.button.toolTitle')}
                lIconName="globe"
              />
            </View>
          </View>
        </View>
        <View style={gStyle.spacer32} />
      </ScrollView>
    </View>
  );
};

// can use this function below, or Expo's Push Notification Tool-> https://expo.io/notifications
// TODO: replace with backend
async function sendPushNotification() {
  retrieveExpoPushToken().then((expoPushToken) => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'HPCI CVT',
      body: 'Message!',
      data: { date: new Date().toString() }
    };

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
  });
}

PushNotificationScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default PushNotificationScreen;
