import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { createStackNavigator } from 'react-navigation-stack';
import { gStyle } from '../constants';

// screens
import HomeScreen from '../screens/HomeScreen';

const HomeTabBarIcon = ({ focused }) => (
  <Icon
    name='home'
    type='font-awesome-5'
    size={20}
    color={
      focused ? gStyle.tintColor.active.light : gStyle.tintColor.inactive.light
    }
  />
);

HomeTabBarIcon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

// Home Stack
// /////////////////////////////////////////////////////////////////////////////
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen
  },
  {
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: HomeTabBarIcon
    }
  }
);

export default HomeStack;
