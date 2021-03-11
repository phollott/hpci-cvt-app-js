import * as React from 'react';
import { ScrollView, Text } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { useTheme } from 'react-navigation';
import { gStyle } from '../constants';

const BookmarksScreen = () => {
  const theme = useTheme();

  // [pmh] assuming we want to add an RNE theme to each screen

  return (
    <ThemeProvider theme={ gStyle.mytheme }>

      <ScrollView
        contentContainerStyle={gStyle.contentContainer}
        style={gStyle.container[theme]}
      >
        <Text style={gStyle.text[theme]}>Bookmarks content area</Text>
      </ScrollView>
      
    </ThemeProvider>
  );
};

BookmarksScreen.navigationOptions = {
  headerTitleStyle: gStyle.headerTitleStyle,
  title: 'Bookmarks'
};

export default BookmarksScreen;
