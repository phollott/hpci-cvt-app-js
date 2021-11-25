import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeNavigator from './HomeNavigator';
import { colors } from '../constants';
import HeaderTitle from '../components/HeaderTitle';
import HomeMenu from '../components/HomeMenu';
import NavigationBack from '../components/NavigationBack';
import NotificationsTouch from '../components/NotificationsTouch';
import AboutScreen from '../screens/AboutScreen';
import LanguageScreen from '../screens/LanguageScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PushNotificationScreen from '../screens/PushNotificationScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle />,
          headerTitleAlign: 'center',
          headerLeft: () => <HomeMenu navigation={navigation} />,
          headerRight: () => <NotificationsTouch navigation={navigation} route={route} />,
          headerStyle: {
            backgroundColor: colors.darkColor
          }
        })}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle />,
          headerTitleAlign: 'center',
          headerLeft: () => <NavigationBack navigation={navigation} route={route} />,
          headerRight: () => <View style={{ flex: 1 }} />,
          headerStyle: {
            backgroundColor: colors.darkColor
          }
        })}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle />,
          headerTitleAlign: 'center',
          headerLeft: () => <NavigationBack navigation={navigation} route={route} />,
          headerRight: () => <View style={{ flex: 1 }} />,
          headerStyle: {
            backgroundColor: colors.darkColor
          }
        })}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle />,
          headerTitleAlign: 'center',
          headerLeft: () => <NavigationBack navigation={navigation} route={route} />,
          headerRight: () => <NotificationsTouch navigation={navigation} route={route} />,
          headerStyle: {
            backgroundColor: colors.darkColor
          }
        })}
      />
      <Stack.Screen
        name="PushNotification"
        component={PushNotificationScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle />,
          headerTitleAlign: 'center',
          headerLeft: () => <NavigationBack navigation={navigation} route={route} />,
          headerRight: () => <View style={{ flex: 1 }} />,
          headerStyle: {
            backgroundColor: colors.darkColor
          }
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
