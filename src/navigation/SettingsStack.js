import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { createStackNavigator } from 'react-navigation-stack';
import { gStyle } from '../constants';

// screens
import SettingsScreen from '../screens/SettingsScreen';

const SettingsTabBarIcon = ({ focused }) => (
  <Icon
    name='cog'
    type='font-awesome-5'
    size={20}
    color={
      focused ? gStyle.tintColor.active.light : gStyle.tintColor.inactive.light
    }
  />
);

SettingsTabBarIcon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

// Settings Stack
// /////////////////////////////////////////////////////////////////////////////
const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen
  },
  {
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: SettingsTabBarIcon
    }
  }
);

export default SettingsStack;
