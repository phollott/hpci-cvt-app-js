import * as React from 'react';
import PropTypes from 'prop-types';
//import { useTheme } from '@react-navigation/native';
import { ThemeProvider } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { gStyle } from '../constants';

// components
import ViewProductDetails from '../components/ViewProductDetails';

const ProductDetailsScreen = ({ navigation, route }) => {
  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const viewProductDetailsKey = language + "ViewProductDetails";
// [pmh] I think it might be possible to just use RNE ThemeProvider and skip useTheme() 
// const theme = useTheme();

  return (
    <ThemeProvider theme={ gStyle.mytheme }>

      <ViewProductDetails navigation={navigation} route={route} key={viewProductDetailsKey} />

    </ThemeProvider>
  );
};

/*********************************************************************************************
 * A Product Detail currently consists of two parts:
 *  a Product Master, similar to the information on the Product Master Screen
 *  Consumer Product Resources, which consist of a description and a link
 * [pmh] possibly a good use of the headerRight would be to allow bookmarking from this screen
 */

ProductDetailsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default ProductDetailsScreen;
