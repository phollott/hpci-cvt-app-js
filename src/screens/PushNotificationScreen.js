import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View, Linking } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import Touch from '../components/Touch';
import ViewCardText from '../components/ViewCardText';
import { notifications } from '../services';

// dev tool

// TODO: if using badges, will need to send empty message with badge count for ios...

const PushNotificationScreen = ({ navigation, route }) => {
  const theme = useTheme();

  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    notifications
      .retrieveExpoPushToken()
      .then((token) => setExpoPushToken(token));
  });

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const pushNotificationViewKey = language.concat('PushNotificationView');

  return (
    <View style={gStyle.container[theme]} key={pushNotificationViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <ViewCardText
          title={t('home.pushNotification.card.title')}
          text={t('home.pushNotification.card.instructionText')}
        />
        <View style={gStyle.spacer32} />
        <View style={{ width: '90%', justifyContent: 'center' }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-around'
            }}
          >
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
            <View style={{ width: '100%', justifyContent: 'center' }}>
              <Touch
                onPress={async () => {
                  await sendPhizerRelatedPushNotification();
                }}
                text={t('home.pushNotification.button.sendTitle').concat(' - Phizer')}
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

// can use this function below, or
// Expo's Push Notification Tool-> https://expo.io/notifications  (data examples: {"nid": 16} or {"nid": [15,16,9]})
// TODO: replace with backend
async function sendPushNotification() {
  notifications.retrieveExpoPushToken().then((expoPushToken) => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      badge: 1,
      title: 'HPCI CVT',
      body: 'Message sent from Send Push Notification.',
      data: { date: new Date().toString() }
    };
    notifications.sendExpoPushNotification(message);
  });
}

async function sendPhizerRelatedPushNotification() {
  notifications.retrieveExpoPushToken().then((expoPushToken) => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      badge: 1,
      title: 'HPCI CVT',
      body: 'Phizer related message sent from Send Push Notification.',
      data: { nid: 16 }
    };
    notifications.sendExpoPushNotification(message);
  });
}

PushNotificationScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default PushNotificationScreen;
