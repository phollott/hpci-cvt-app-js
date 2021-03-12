import { createBottomTabNavigator } from 'react-navigation-tabs';
import { colors } from '../constants';

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
      activeTintColor: colors.activeTintColor,
      inactiveTintColor: colors.inactiveTintColor
    }
  }
);

export default BottomTabNavigator;
