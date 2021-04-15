import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { t } from 'i18n-js';
import { gStyle } from '../constants';

import HomeMenu from '../components/HomeMenu';

// screens
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={({ navigation, route }) => ({
          headerTitleStyle: gStyle.headerTitleStyle,
          title: t('stack.screen.homeTitle'),
          headerLeft: () => <View style={{ flex: 1 }} />,
          headerRight: () => <HomeMenu navigation={navigation} route={route} />
        })}
      />
      <Stack.Screen 
        name="Menu" 
        component={MenuScreen}
        options={() => ({
          headerTitleStyle: gStyle.headerTitleStyle,
          title: t('stack.screen.menuTitle'),
          headerLeft: () => <View style={{ flex: 1 }} />,
          headerRight: () => <View style={{ flex: 1 }} />
        })}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
