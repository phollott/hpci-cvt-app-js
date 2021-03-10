import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { createStackNavigator } from 'react-navigation-stack';

// screens
import BookmarksScreen from '../screens/BookmarksScreen';

const BookmarksTabBarIcon = ({ focused }) => 
  <Icon name='bookmark' type='font-awesome-5' size={20} color={focused ? 'black' : '#d3d3d3'} />

BookmarksTabBarIcon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

// Stats Stack
// /////////////////////////////////////////////////////////////////////////////
const BookmarksStack = createStackNavigator(
  {
    Stats: BookmarksScreen
  },
  {
    navigationOptions: {
      tabBarLabel: 'Bookmarks',
      tabBarIcon: BookmarksTabBarIcon
    }
  }
);

export default BookmarksStack;
