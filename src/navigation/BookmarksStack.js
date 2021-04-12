import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';

// screens
import BookmarksScreen from '../screens/BookmarksScreen';

const Stack = createStackNavigator();

const BookmarksStack = () => {
  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const bookmarksStackKey = language + "BookmarksStack";

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Bookmarks" 
        component={BookmarksScreen}
        options={{
          headerTitleStyle: gStyle.headerTitleStyle,
          title: t('stack.screen.bookmarksTitle')
        }}
        key={bookmarksStackKey}
      />
    </Stack.Navigator>
  );
}

export default BookmarksStack;
