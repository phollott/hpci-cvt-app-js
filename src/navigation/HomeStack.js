import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { t } from 'i18n-js';
import { gStyle } from '../constants';

import HomeNavigator from './HomeNavigator';
import HomeMenu from '../components/HomeMenu';
import NavigationBack from '../components/NavigationBack';
import LanguageScreen from '../screens/LanguageScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitleStyle: gStyle.headerTitleStyle,
          title: t('stack.screen.homeTitle'),
          headerLeft: () => <View style={{ flex: 1 }} />,
          headerRight: () => <HomeMenu navigation={navigation} />
        })}
      />
      <Stack.Screen 
        name="Language" 
        component={LanguageScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitleStyle: gStyle.headerTitleStyle,
          title: t('stack.screen.languageTitle'),
          headerLeft: () => <NavigationBack navigation={navigation} route={route} />,
          headerRight: () => <View style={{ flex: 1 }} />
        })}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
