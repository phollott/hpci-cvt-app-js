import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { gStyle } from '../constants';

// components
import ViewProductResource from '../components/ViewProductResource';

const ProductResourceScreen = ({ navigation, route }) => {
  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const viewProductResourceKey = language + "viewProductResource";
  //const theme = useTheme();

  // [pmh] assuming we want to add an RNE theme to each screen

  return (
    <ThemeProvider theme={ gStyle.mytheme }>

      <ViewProductResource navigation={navigation} route={route} key={viewProductResourceKey} />

    </ThemeProvider>
  );
};

ProductResourceScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default ProductResourceScreen;
