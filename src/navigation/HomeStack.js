import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';

// screens
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const homeStackKey = language + "HomeStack";

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerTitleStyle: gStyle.headerTitleStyle,
          title: t('stack.screen.homeTitle')
        }}
        key={homeStackKey}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
