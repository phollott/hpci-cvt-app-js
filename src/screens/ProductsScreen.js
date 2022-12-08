import * as React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// components
import ViewCovid19Products from '../components/ViewCovid19Products';

const ProductsScreen = ({ navigation, route }) => {
  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  let viewCovid19ProductsKey = language.concat('ViewCovid19Products');

  // concat product action so screen rerenders when key changes
  if (
    typeof route.params !== 'undefined' &&
    typeof route.params.productAction !== 'undefined'
  ) {
    viewCovid19ProductsKey = viewCovid19ProductsKey.concat(
      route.params.productAction
    );
  }

  return (
    <ViewCovid19Products navigation={navigation} key={viewCovid19ProductsKey} />
  );
};

ProductsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default ProductsScreen;
