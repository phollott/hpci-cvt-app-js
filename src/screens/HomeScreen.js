import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, Text, View } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Button, Card } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { colors, gStyle, images } from '../constants';
import { storage } from '../services';


//TODO: review... sound and alert works on ios and android, but, as implemented, 
//                badge count only works on android (ios will show, but does not reset badge when user clicks on notification)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const homeViewKey = language + "HomeView";

  const titleLogo = 'canadianHealthProductsLogo';

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

  return (
    <View style={gStyle.container[theme]} key={homeViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <View style={{ width: '100%', justifyContent: 'center' }}>
          <Card style={{ borderRadius: 0, marginHorizontal: 0, marginTop: 0 }}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.darkColor, fontWeight: 'bold', fontSize: 24 }}>
                {t('home.introCard.title')}
              </Text>
            </Card.Content>
            <View style={gStyle.spacer16} />
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  style={{ height: 120, width: 120, marginHorizontal: 16 }}
                  source={images[titleLogo]}
                />
                <Text style={{ color: colors.darkColor, fontSize: 18, flex: 1, flexWrap: 'wrap', marginRight: 4 }}>
                  {t('home.introCard.meta')}
                </Text>
              </View>
            </Card.Content>
            <View style={gStyle.spacer16} />
            <Card.Content>
              <Text style={{ color: colors.darkColor, fontSize: 16 }}>
                {t('home.introCard.text')}
              </Text>
            </Card.Content>
          </Card>
        </View>
        <View style={gStyle.spacer8} />
        <View style={{ width: '100%' }}>
          <Card style={{ borderRadius: 0, marginHorizontal: 0, marginTop: 0 }}>
            <Card.Content>
              <Text style={{ color: colors.darkColor, fontWeight: 'bold', fontSize: 18 }}>
                {t('home.infoCard.title')}
              </Text>
            </Card.Content>
            <View style={gStyle.spacer16} />
            <Card.Content>
              <Text style={{ color: colors.darkColor, fontSize: 14 }}>
                {t('home.infoCard.currentText')}
              </Text>
              <View style={gStyle.spacer16} />
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  onPress={() => {
                    navigation.navigate('ProductsStack', {screen: 'Products'});
                  }}
                  icon="checkbox-marked-circle-outline"
                  labelStyle={{ color: colors.black, fontSize: 12 }}
                  mode="contained"
                  style={{
                    backgroundColor: colors.lightGrey,
                    borderRadius: 20,
                    width: '90%'
                  }}
                  uppercase={false}
                >
                  {t('home.infoCard.products.covidTitle')}
                </Button>
              </View>
              <View style={gStyle.spacer16} />
              <Text style={{ color: colors.darkColor, fontSize: 14 }}>
                {t('home.infoCard.futureText')}
              </Text>
              <View style={gStyle.spacer16} />
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  onPress={() => {}}
                  disabled
                  labelStyle={{ color: colors.grey, fontSize: 12 }}
                  mode="contained"
                  style={{
                    backgroundColor: colors.lightGrey,
                    borderRadius: 20,
                    width: '90%'
                  }}
                  uppercase={false}
                >
                  {t('home.infoCard.products.drugsTitle')}
                </Button>
              </View>
              <View style={gStyle.spacer8} />
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  onPress={() => {}}
                  disabled
                  labelStyle={{ color: colors.grey, fontSize: 12 }}
                  mode="contained"
                  style={{
                    backgroundColor: colors.lightGrey,
                    borderRadius: 20,
                    width: '90%'
                  }}
                  uppercase={false}
                >
                  {t('home.infoCard.products.naturalTitle')}
                </Button>
              </View>
              <View style={gStyle.spacer8} />
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  onPress={() => {}}
                  disabled
                  labelStyle={{ color: colors.grey, fontSize: 12 }}
                  mode="contained"
                  style={{
                    backgroundColor: colors.lightGrey,
                    borderRadius: 20,
                    width: '90%'
                  }}
                  uppercase={false}
                >
                  {t('home.infoCard.products.devicesTitle')}
                </Button>
              </View>
              <View style={gStyle.spacer8} />
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  onPress={() => {}}
                  disabled
                  labelStyle={{ color: colors.grey, fontSize: 12 }}
                  mode="contained"
                  style={{
                    backgroundColor: colors.lightGrey,
                    borderRadius: 20,
                    width: '90%'
                  }}
                  uppercase={false}
                >
                  {t('home.infoCard.products.veterinaryTitle')}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
        <View style={gStyle.spacer32} />
      </ScrollView>
    </View>
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
  navigation: PropTypes.object.isRequired
};

export default HomeScreen;
