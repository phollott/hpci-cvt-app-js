import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { createStackNavigator } from 'react-navigation-stack';

// screens
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProductResourceScreen from '../screens/ProductResourceScreen';

const ProductsTabBarIcon = ({ focused }) => 
  <Icon name='shield-virus' type='font-awesome-5' size={20} color={focused ? 'black' : '#d3d3d3'} />

ProductsTabBarIcon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

// Multi Stack
// /////////////////////////////////////////////////////////////////////////////
const ProductsStack = createStackNavigator(
  {
    Products: ProductsScreen,
    ProductDetails: ProductDetailsScreen,
    ProductResource: ProductResourceScreen
  },
  {
    navigationOptions: {
      tabBarLabel: 'CVT Products',
      tabBarIcon: ProductsTabBarIcon
    }
  }
);

export default ProductsStack;
