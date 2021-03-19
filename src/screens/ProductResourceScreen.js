import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'react-native-elements';
import { gStyle } from '../constants';

// components
import ViewProductResource from '../components/ViewProductResource';

const ProductResourceScreen = ({ navigation, route }) => {
  //const theme = useTheme();

  // [pmh] assuming we want to add an RNE theme to each screen

  return (
    <ThemeProvider theme={ gStyle.mytheme }>

      <ViewProductResource navigation={navigation} route={route} />

    </ThemeProvider>
  );
};

ProductResourceScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default ProductResourceScreen;
