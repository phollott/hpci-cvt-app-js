import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { t } from 'i18n-js';
import { gStyle } from '../constants';

import NavigationBack from '../components/NavigationBack';
import BookmarkProduct from '../components/BookmarkProduct';

// screens
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProductResourceScreen from '../screens/ProductResourceScreen';

// Multi Stack
// /////////////////////////////////////////////////////////////////////////////
const Stack = createStackNavigator();

const ProductsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Products" 
        component={ProductsScreen}
        options={{
          headerTitleStyle: gStyle.headerTitleStyle,
          title: t('stack.screen.productsTitle')
        }}
      />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen}
        options={({ navigation, route }) => ({
          headerTitleStyle: gStyle.headerTitleStyle,
          title: t('stack.screen.productDetailsTitle'),
          headerLeft: () => <NavigationBack navigation={navigation} route={route} />,
          headerRight: () => <BookmarkProduct />
        })}
      />
      <Stack.Screen 
        name="ProductResource" 
        component={ProductResourceScreen}
        options={({ navigation, route }) => ({
          headerTitleStyle: gStyle.headerTitleStyle,
          title: t('stack.screen.productResourceTitle'),
          headerLeft: () => <NavigationBack navigation={navigation} route={route} />,
          headerRight: () => <View style={{ flex: 1 }} />
        })}
      />
    </Stack.Navigator>
  );
}

export default ProductsStack;
