import { createBottomTabNavigator } from 'react-navigation-tabs';
import { gStyle } from '../constants';

// navigation stacks
import HomeStack from './HomeStack';
import ProductsStack from './ProductsStack';
import BookmarksStack from './BookmarksStack';
// import SettingsStack from './SettingsStack';

const BottomTabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    ProductsStack,
    BookmarksStack
    // , SettingsStack
  },
  {
    initialRouteName: 'HomeStack',
    tabBarOptions: {
      activeTintColor: gStyle.tintColor.active,
      inactiveTintColor: gStyle.tintColor.inactive
    }
  }
);

export default BottomTabNavigator;
