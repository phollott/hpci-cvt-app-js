import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { t } from 'i18n-js';
import { gStyle } from '../constants';

// screens
import BookmarksScreen from '../screens/BookmarksScreen';

const Stack = createStackNavigator();

const BookmarksStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Bookmarks" 
        component={BookmarksScreen}
        options={{
          headerTitleStyle: gStyle.headerTitleStyle,
          title: t('stack.screen.bookmarksTitle')
        }}
      />
    </Stack.Navigator>
  );
}

export default BookmarksStack;
