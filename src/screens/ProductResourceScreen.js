import * as React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-navigation';
import { gStyle } from '../constants';

// components
import ViewProductResource from '../components/ViewProductResource';
import NavigationBack from '../components/NavigationBack';

const ProductResourceScreen = ({ navigation }) => {
  const theme = useTheme();

  return (

    <ViewProductResource navigation={navigation}/>

  );
};

ProductResourceScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: () => <NavigationBack navigation={navigation} />,
  headerRight: () => <View style={{ flex: 1 }} />,
  headerTitleStyle: gStyle.headerTitleStyle,
  title: 'Product Resource'
});

export default ProductResourceScreen;
