import * as React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// components
import ViewBookmarkedProducts from '../components/ViewBookmarkedProducts';

const BookmarksScreen = ({ navigation, route }) => {
  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  let viewBookmarkedProductsKey = language + "ViewBookmarkedProducts";

  // concat bookmark action so screen rerenders when bookmark is added or cleared
  if (typeof route.params !== "undefined" && typeof route.params.bookmarkAction !== "undefined") {
    viewBookmarkedProductsKey = viewBookmarkedProductsKey.concat(route.params.bookmarkAction);
  }

  return (
    <ViewBookmarkedProducts navigation={navigation} key={viewBookmarkedProductsKey}/>
  );
};

BookmarksScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default BookmarksScreen;
