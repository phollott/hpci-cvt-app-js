import * as React from 'react';
import PropTypes from 'prop-types';
//import { useTheme } from '@react-navigation/native';
import { ThemeProvider } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { gStyle } from '../constants';

// components
import ViewCovid19Products from '../components/ViewCovid19Products';

const ProductsScreen = ({ navigation }) => {
  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const viewCovid19ProductsKey = language + "ViewCovid19Products";
  //const theme = useTheme();

  // There are two different approaches to themes at play here, and both live in globalStyles
  // ThemeProvider is used by react-native-elements components, and is
  // contentContainerStyle in the View is used by other components - not sure this is necessary
  return (
    <ThemeProvider theme={ gStyle.mytheme }>

      <ViewCovid19Products navigation={navigation} key={viewCovid19ProductsKey}/>
      
    </ThemeProvider>
  )
};

ProductsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default ProductsScreen;
