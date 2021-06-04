import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeNavigator from './HomeNavigator';
import HeaderTitle from '../components/HeaderTitle';
import HomeMenu from '../components/HomeMenu';
import NavigationBack from '../components/NavigationBack';
import LanguageScreen from '../screens/LanguageScreen';
import PushNotificationScreen from '../screens/PushNotificationScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle />,
          headerTitleAlign: 'center',
          headerLeft: () => <HomeMenu navigation={navigation} />,
          headerRight: () => <View style={{ flex: 1 }} />
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
          headerRight: () => <View style={{ flex: 1 }} />
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
          headerRight: () => <View style={{ flex: 1 }} />
        })}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
