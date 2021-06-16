import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../constants';
// grab tabbed stacks
import TabNavigator from './TabNavigator';

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.lightGrey
  }
};

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <NavigationContainer theme={appTheme}>
      <Stack.Navigator
        headerMode="none"
        initialRouteName="TabNavigator"
        mode="modal"
      >
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
