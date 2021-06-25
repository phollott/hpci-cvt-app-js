import * as React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// components
import ViewProductDetails from '../components/ViewProductDetails';

const ProductDetailsScreen = ({ navigation, route }) => {
  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const viewProductDetailsKey = language.concat('ViewProductDetails');

  return (
    <ViewProductDetails navigation={navigation} route={route} key={viewProductDetailsKey} />
  );
};

ProductDetailsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default ProductDetailsScreen;
