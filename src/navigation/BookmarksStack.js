import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderTitle from '../components/HeaderTitle';
import NavigationBack from '../components/NavigationBack';
import BookmarkTouch from '../components/BookmarkTouch';
import BookmarksScreen from '../screens/BookmarksScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

const Stack = createStackNavigator();

const BookmarksStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Bookmarks" 
        component={BookmarksScreen}
        options={{
          headerShown: true,
          headerTitle: () => <HeaderTitle />,
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen 
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle />,
          headerTitleAlign: 'center',
          headerLeft: () => <NavigationBack navigation={navigation} route={route} />,
          headerRight: () => <BookmarkTouch navigation={navigation} route={route} />
        })}
      />
    </Stack.Navigator>
  );
}

export default BookmarksStack;
