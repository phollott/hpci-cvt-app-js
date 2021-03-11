import * as React from 'react';
import { View } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { useTheme } from 'react-navigation';
import { gStyle } from '../constants';

// components
import ViewProductResource from '../components/ViewProductResource';
import NavigationBack from '../components/NavigationBack';

const ProductResourceScreen = ({ navigation }) => {
  const theme = useTheme();

  // [pmh] assuming we want to add an RNE theme to each screen

  return (
    <ThemeProvider theme={ gStyle.mytheme }>

      <ViewProductResource navigation={navigation}/>

    </ThemeProvider>
  );
};

ProductResourceScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: () => <NavigationBack navigation={navigation} />,
  headerRight: () => <View style={{ flex: 1 }} />,
  headerTitleStyle: gStyle.headerTitleStyle,
  title: 'Product Resource'
});

export default ProductResourceScreen;
