import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, Text, View } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Button, Card, ThemeProvider } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import {t} from 'i18n-js';
import { gStyle, images } from '../constants';
import Icon from '../components/Icon';
import { storage } from '../services';


//TODO: review... sound and alert works on ios and android, but, as implemented, 
//                badge count only works on android (ios will show, but does not reset badge when user clicks on notification)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

//const HomeScreen = ({ navigation, screenProps }) => {
const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const homeViewKey = language + "HomeView";

  const titleLogo = 'covidAlertLogo';

  const notificationListener = useRef();
  const responseListener = useRef();
  
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // this listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('addNotificationReceivedListener (fired whenever a notification is received while the app is foregrounded)...');
      console.log('notification received while app is foregrounded: ', notification);
      // TODO, for now, nav to dev tool
      navigation.navigate('HomeStack', {
        screen: 'PushNotification', 
        params: { 
          pushNotification: JSON.stringify(notification),
          pushNotificationAction: 'notification-'.concat((new Date()).getTime().toString())   
        }
      });
    });

    // this listener is fired whenever a user taps on or interacts with a notification 
    // note: this is supposed to work when app is foregrounded, backgrounded, or killed
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('addNotificationResponseReceivedListener (fired whenever a user taps on or interacts with a notification)...');
      console.log('notification received, response: ', response);
      // TODO, for now, nav to dev tool
      navigation.navigate('HomeStack', {
        screen: 'PushNotification', 
        params: { 
          pushNotification: JSON.stringify(response.notification),
          pushNotificationAction: 'notification-'.concat((new Date()).getTime().toString())   
        }
      });
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      console.log('removed notification subscriptions');
    };
  }, []);

// [pmh] this method of applying dark mode should work with RNE, but is untested

  return (
    <ThemeProvider theme={ gStyle.mytheme } useDark={ colorScheme === 'dark' }>

      <View style={gStyle.container[theme]} key={homeViewKey}>
        <ScrollView contentContainerStyle={gStyle.contentContainer}>
          <View style={{ width: '100%', justifyContent: 'center' }}>
            <Card>
              <Card.Title style={gStyle.text[theme], {fontSize: 18}}>{ t('home.introCard.title') }</Card.Title>
              <View style={{ flex: 1 }}>
                <Image
                  style={{ alignSelf: 'center', height: 120, width: 120 }}
                  source={images[titleLogo]}
                />
                <View style={gStyle.spacer16} />
              </View>
              <Text style={gStyle.text[theme], {fontSize: 16}}>{ t('home.introCard.text') }</Text>
            </Card>
          </View>
          <View style={gStyle.spacer32} />
          <Button
            onPress={() => {
              navigation.navigate('ProductsStack', {screen: 'Products'});
            }}
            icon={
              <Icon name='shield-virus' size={40} style={{paddingRight: 8}} />
            }
            title={ t('home.button.products.title') }
            containerStyle={ gStyle.container.light }
            titleStyle={{ color: "black" }}
            raised={true}
            type="outline"
          />
          <View style={gStyle.spacer32} />
        </ScrollView>
      </View>
      
    </ThemeProvider>
  );
};

// TODO: only storing for dev tools, may remove at some point (see PushNotificationScreen)
async function setExpoPushToken(token) {
  try {
    await storage.save('expoPushToken', typeof token !== 'undefined' ? token : '');
  } catch (error) {
    console.log('Unable to save expoPushToken to storage. ', error);
  }
}

// TODO: store token on backend, notification settings?
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // android users do not get prompted (permissions are enabled by default, so user will need to re-enable)
      console.log('Failed to get push token for push notification!');
      return;
    }
    // expo managed (would need to provide experience ID if bare)
    //token = (await Notifications.getExpoPushTokenAsync()).data;
    let experienceId = '@hpci-cvt/hpci-cvt-app-js';
    token = (await Notifications.getExpoPushTokenAsync(experienceId)).data;
    console.log('Received Expo push token: ', token);
  } else {
    console.log('Must use physical device for Push Notifications.');
  }
  // need to specify a channel if android, see expo-notifications documentation
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}

HomeScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired //,
  //screenProps: PropTypes.object.isRequired
};

export default HomeScreen;
