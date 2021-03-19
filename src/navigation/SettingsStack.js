import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { gStyle } from '../constants';

// screens
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerTitleStyle: gStyle.headerTitleStyle,
          title: 'Settings'
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingsStack;
