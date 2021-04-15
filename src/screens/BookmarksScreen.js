import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, ThemeProvider } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { t } from 'i18n-js';
import { gStyle } from '../constants';

const BookmarksScreen = () => {
  const theme = useTheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const bookmarksViewKey = language + "BookmarksView";

  // [pmh] assuming we want to add an RNE theme to each screen

  return (
    <ThemeProvider theme={ gStyle.mytheme }>

      <View style={gStyle.container[theme]} key={bookmarksViewKey}>
        <ScrollView
          contentContainerStyle={gStyle.contentContainer}
        >
          <View style={{ width: '100%', justifyContent: 'center' }}>
            <Card>
              <Text style={gStyle.text[theme], {fontSize: 16}}>{ t('bookmarks.introText') }</Text>
            </Card>
          </View>
        </ScrollView>
      </View>
      
    </ThemeProvider>
  );
};

export default BookmarksScreen;
