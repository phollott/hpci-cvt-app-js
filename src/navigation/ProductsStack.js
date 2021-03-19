import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
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
          title: 'COVID-19 Health Products'
        }}
      />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen}
        options={({ navigation, route }) => ({
          headerTitleStyle: gStyle.headerTitleStyle,
          title: 'Product Details',
          headerLeft: () => <NavigationBack navigation={navigation} route={route} />,
          headerRight: () => <BookmarkProduct />
        })}
      />
      <Stack.Screen 
        name="ProductResource" 
        component={ProductResourceScreen}
        options={({ navigation, route }) => ({
          headerTitleStyle: gStyle.headerTitleStyle,
          title: 'Product Resource',
          headerLeft: () => <NavigationBack navigation={navigation} route={route} />,
          headerRight: () => <View style={{ flex: 1 }} />
        })}
      />
    </Stack.Navigator>
  );
}

export default ProductsStack;
