import * as React from 'react';
import PropTypes from 'prop-types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
// navigation stacks
import HomeStack from './HomeStack';
import ProductsStack from './ProductsStack';
import BookmarksStack from './BookmarksStack';
import Icon from '../components/Icon';

// HomeTabBarIcon
const HomeTabBarIcon = ({ focused }) => (
  <Icon name='home' focused={focused} />
);

HomeTabBarIcon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

// ProductsTabBarIcon
const ProductsTabBarIcon = ({ focused }) => (
  <Icon name='shield-virus' focused={focused} />
);

ProductsTabBarIcon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

// BookmarksTabBarIcon
const BookmarksTabBarIcon = ({ focused }) => (
  <Icon name='bookmark' focused={focused} />
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
          tabBarLabel: t('tab.screen.homeLabel'),
          tabBarIcon: HomeTabBarIcon
        }}
      />
      <Tab.Screen
        name="ProductsStack"
        component={ProductsStack}
        options={{
          tabBarLabel: t('tab.screen.productsLabel'),
          tabBarIcon: ProductsTabBarIcon
        }}
      />
      <Tab.Screen
        name="BookmarksStack"
        component={BookmarksStack}
        options={{
          tabBarLabel: t('tab.screen.bookmarksLabel'),
          tabBarIcon: BookmarksTabBarIcon
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
