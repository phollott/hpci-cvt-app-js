import * as React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { useTheme } from 'react-navigation';
import { gStyle } from '../constants';


import { useColorScheme } from 'react-native-appearance';

// components
import Touch from '../components/Touch';

const HomeScreen = ({ navigation, screenProps }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

// [pmh] this method of setting English/French is problematic because it does not force a reload,
// so if it is not applied early, screens are already loaded, and will have their language set
// [pmh] this method of uapplying dark mode should work with RNE, but is untested

  return (
    <ThemeProvider theme={ gStyle.mytheme } useDark={ colorScheme === 'dark' }>

      <View style={gStyle.container[theme]}>
        <ScrollView contentContainerStyle={gStyle.contentContainer}>
          <Text style={gStyle.text[theme]}>Home content area</Text>

          <View style={gStyle.spacer64} />

          <Touch
            onPress={() => {
              global.language = 'en-ca';
              navigation.navigate('Products');
            }}
            text="Jump to English Products Screen"
          />
          <Touch
            onPress={() => {
              global.language = 'fr-ca';
              navigation.navigate('Products');
            }}
            text="Produits en Francais"
          />

        </ScrollView>
      </View>
      
    </ThemeProvider>
  );
};

HomeScreen.navigationOptions = {
  headerTitleStyle: gStyle.headerTitleStyle,
  title: 'Home'
};

HomeScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired
};

export default HomeScreen;
