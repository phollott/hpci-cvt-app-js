import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { gStyle } from '../constants';
// navigation stacks
import HomeStack from './HomeStack';
import ProductsStack from './ProductsStack';
import BookmarksStack from './BookmarksStack';

// HomeTabBarIcon
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

// ProductsTabBarIcon
const ProductsTabBarIcon = ({ focused }) => (
  <Icon
    name='shield-virus'
    type='font-awesome-5'
    size={20}
    color={
      focused ? gStyle.tintColor.active.light : gStyle.tintColor.inactive.light
    }
  />
);

ProductsTabBarIcon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

// BookmarksTabBarIcon
const BookmarksTabBarIcon = ({ focused }) => (
  <Icon
    name='bookmark'
    type='font-awesome-5'
    size={20}
    color={
      focused ? gStyle.tintColor.active.light : gStyle.tintColor.inactive.light
    }
  />
);

BookmarksTabBarIcon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

// TabNavigator
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      tabBarOptions={{
        activeTintColor: gStyle.tintColor.active.light,
        inactiveTintColor: gStyle.tintColor.inactive.light
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: HomeTabBarIcon
        }}
      />
      <Tab.Screen
        name="ProductsStack"
        component={ProductsStack}
        options={{
          tabBarLabel: "CVT Products",
          tabBarIcon: ProductsTabBarIcon
        }}
      />
      <Tab.Screen
        name="BookmarksStack"
        component={BookmarksStack}
        options={{
          tabBarLabel: "Bookmarks",
          tabBarIcon: BookmarksTabBarIcon
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
