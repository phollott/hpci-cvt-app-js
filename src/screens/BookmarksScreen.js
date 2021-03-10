import * as React from 'react';
import { ScrollView, Text } from 'react-native';
import { useTheme } from 'react-navigation';
import { gStyle } from '../constants';

const BookmarksScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={gStyle.contentContainer}
      style={gStyle.container[theme]}
    >
      <Text style={gStyle.text[theme]}>Bookmarks content area</Text>
    </ScrollView>
  );
};

BookmarksScreen.navigationOptions = {
  headerTitleStyle: gStyle.headerTitleStyle,
  title: 'Bookmarks'
};

export default BookmarksScreen;
