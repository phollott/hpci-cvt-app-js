import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { ScrollView, Text, View, Linking } from 'react-native';
import { Button, ThemeProvider } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { gStyle } from '../constants';
import { useColorScheme } from 'react-native-appearance';
import Icon from '../components/Icon';
import { storage } from '../services';
import {t} from 'i18n-js';

// dev tool

const retrieveExpoPushToken = async () => {
  try {
    return value = await storage.retrieve('expoPushToken');
  } catch (error) {
    console.log('Unable to retrieve expoPushToken. ', error);
  }
}

const PushNotificationScreen = ({ navigation, route }) => { 
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    retrieveExpoPushToken().then(token => setExpoPushToken(token));
  });

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  let pushNotificationViewKey = language + "PushNotificationView";

  let notification;
  // check for notification and concat notification action so screen rerenders when notification is received
  if (typeof route.params !== "undefined" && typeof route.params.pushNotification !== "undefined") {
    notification = JSON.parse(route.params.pushNotification);
    pushNotificationViewKey = pushNotificationViewKey.concat(route.params.pushNotificationAction);
  }

// [pmh] this method of applying dark mode should work with RNE, but is untested

  return (
    <ThemeProvider theme={ gStyle.mytheme } useDark={ colorScheme === 'dark' }>

      <View style={gStyle.container[theme]} key={pushNotificationViewKey}>
        <ScrollView contentContainerStyle={gStyle.contentContainer}>
          <View style={{ width: '90%', justifyContent: 'center' }}>
            
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-around'
            }}>
              <Text>{t('home.pushNotification.notification.heading')}: </Text>
              <View style={gStyle.spacer8} />
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>{t('home.pushNotification.notification.title')}: {notification && notification.request.content.title} </Text>
                <Text>{t('home.pushNotification.notification.body')}: {notification && notification.request.content.body}</Text>
                <Text>{t('home.pushNotification.notification.data')}: {notification && JSON.stringify(notification.request.content.data)}</Text>
              </View>
              <View style={gStyle.spacer64} />
              <Button
                title={ t('home.pushNotification.button.sendTitle') }
                onPress={async () => {
                  await sendPushNotification();
                }}
                icon={
                  <Icon name='share' size={40} style={{paddingRight: 8}} />
                }
                containerStyle={ gStyle.container.light }
                titleStyle={{ color: "black" }}
                raised={true}
                type="outline"
              />
              <View style={gStyle.spacer64} />
              <Text>Expo Push Token:</Text>
              <View style={gStyle.spacer8} />
              <Text selectable={true} style={gStyle.text[theme], {fontSize: 14, fontWeight: 'bold'}}>{expoPushToken}</Text>
              <View style={gStyle.spacer32} />
              <Button
                onPress={() => {
                  const epntUrl = 'https:expo.io/notifications';
                  Linking.canOpenURL(epntUrl).then( supported => {
                    if (supported) {
                      Linking.openURL(epntUrl);
                    }
                  })
                }}
                icon={
                  <Icon name='globe' size={40} style={{paddingRight: 8}} />
                }
                title={ t('home.pushNotification.button.toolTitle') }
                containerStyle={ gStyle.container.light }
                titleStyle={{ color: "black" }}
                raised={true}
                type="outline"
              />
            </View>

          </View>
          <View style={gStyle.spacer32} />
        </ScrollView>
      </View>
      
    </ThemeProvider>
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
      data: { 'date': (new Date()).toString() },
    };
  
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  });
}

PushNotificationScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default PushNotificationScreen;
