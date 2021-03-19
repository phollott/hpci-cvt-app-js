import * as React from 'react';
import PropTypes from 'prop-types';
//import { useTheme } from '@react-navigation/native';
import { ThemeProvider } from 'react-native-elements';
import { gStyle } from '../constants';

// components
import ViewCovid19Products from '../components/ViewCovid19Products';

const ProductsScreen = ({ navigation }) => {
  //const theme = useTheme();

  // There are two different approaches to themes at play here, and both live in globalStyles
  // ThemeProvider is used by react-native-elements components, and is
  // contentContainerStyle in the View is used by other components - not sure this is necessary
  return (
    <ThemeProvider theme={ gStyle.mytheme }>

      <ViewCovid19Products navigation={navigation} />
      
    </ThemeProvider>
  )
};

ProductsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default ProductsScreen;
