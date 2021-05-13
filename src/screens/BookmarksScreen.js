import * as React from 'react';
import PropTypes from 'prop-types';
//import { useTheme } from '@react-navigation/native';
import { ThemeProvider } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { gStyle } from '../constants';

// components
import ViewBookmarkedProducts from '../components/ViewBookmarkedProducts';

const BookmarksScreen = ({ navigation, route }) => {
  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  let viewBookmarkedProductsKey = language + "ViewBookmarkedProducts";
  //const theme = useTheme();

  // concat bookmark action so screen rerenders when bookmark is added or cleared
  if (typeof route.params !== "undefined" && typeof route.params.bookmarkAction !== "undefined") {
    viewBookmarkedProductsKey = viewBookmarkedProductsKey.concat(route.params.bookmarkAction);
  }

  // There are two different approaches to themes at play here, and both live in globalStyles
  // ThemeProvider is used by react-native-elements components, and is
  // contentContainerStyle in the View is used by other components - not sure this is necessary
  return (
    <ThemeProvider theme={ gStyle.mytheme }>

      <ViewBookmarkedProducts navigation={navigation} key={viewBookmarkedProductsKey}/>
      
    </ThemeProvider>
  )
};

BookmarksScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default BookmarksScreen;
