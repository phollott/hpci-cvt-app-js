import * as React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// components
import ViewCovid19Products from '../components/ViewCovid19Products';

const ProductsScreen = ({ navigation }) => {
  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const viewCovid19ProductsKey = language.concat('ViewCovid19Products');

  return (
    <ViewCovid19Products navigation={navigation} key={viewCovid19ProductsKey} />
  );
};

ProductsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default ProductsScreen;
