import * as React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useTheme } from 'react-navigation';
import { gStyle } from '../constants';

// components
import ViewCovid19Products from '../components/ViewCovid19Products';
import { Dimensions } from 'react-native';

const ProductsScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View
      contentContainerStyle={gStyle.contentContainer}
      style={gStyle.container[theme]}
    >

      <ViewCovid19Products
        navigation={navigation} 
        width={Dimensions.get('window').width-30}
      />

    </View>
  )
};

ProductsScreen.navigationOptions = {
  headerTitleStyle: gStyle.headerTitleStyle,
  title: 'COVID-19 Health Products'
};

ProductsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default ProductsScreen;
