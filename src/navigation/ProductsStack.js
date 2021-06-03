import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderTitle from '../components/HeaderTitle';
import NavigationBack from '../components/NavigationBack';
import BookmarkProduct from '../components/BookmarkProduct';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

const Stack = createStackNavigator();

const ProductsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Products" 
        component={ProductsScreen}
        options={{
          headerShown: true,
          headerTitle: () => ( <HeaderTitle /> ),
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: () => ( <HeaderTitle /> ),
          headerTitleAlign: 'center',
          headerLeft: () => <NavigationBack navigation={navigation} route={route} />,
          headerRight: () => <BookmarkProduct navigation={navigation} route={route} />
        })}
      />
    </Stack.Navigator>
  );
}

export default ProductsStack;
