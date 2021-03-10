import * as React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useTheme } from 'react-navigation';
import { gStyle } from '../constants';

// components
import ViewProductDetails from '../components/ViewProductDetails';
import NavigationBack from '../components/NavigationBack';

const ProductDetailsScreen = ({ navigation }) => {
  const theme = useTheme();

  return (

    <ViewProductDetails navigation={navigation}/>

  );
};

/*********************************************************************************************
 * A Product Detail currently consists of two parts:
 *  a Product Master, similar to the information on the Product Master Screen
 *  Consumer Product Resources, which consist of a description and a link
 * [pmh] possibly a good use of the headerRight would be to allow bookmarking from this screen
 */

ProductDetailsScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: () => <NavigationBack navigation={navigation} />,
  headerRight: () => <View style={{ flex: 1 }} />,
  headerTitleStyle: gStyle.headerTitleStyle,
  title: 'Product Details'
});

ProductDetailsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default ProductDetailsScreen;
