import * as React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import { setLanguage } from '../redux/actions/settingsActions'
import { gStyle } from '../constants';
import { lang } from '../constants/constants';
import { useColorScheme } from 'react-native-appearance';

// components
import Touch from '../components/Touch';

//const HomeScreen = ({ navigation, screenProps }) => {
  const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const dispatch = useDispatch();
  const setLang = lang => dispatch(setLanguage(lang));

// [pmh] this method of uapplying dark mode should work with RNE, but is untested

  return (
    <ThemeProvider theme={ gStyle.mytheme } useDark={ colorScheme === 'dark' }>

      <View style={gStyle.container[theme]}>
        <ScrollView contentContainerStyle={gStyle.contentContainer}>
          <Text style={gStyle.text[theme]}>Home content area</Text>

          <View style={gStyle.spacer64} />

          <Touch
            onPress={() => {
              setLang(lang.english);
              navigation.navigate('ProductsStack', {screen: 'Products'});
            }}
            text="Jump to English Products Screen"
          />
          <Touch
            onPress={() => {
              setLang(lang.french);
              navigation.navigate('ProductsStack', {screen: 'Products'});
            }}
            text="Produits en Francais"
          />

        </ScrollView>
      </View>
      
    </ThemeProvider>
  );
};

HomeScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired //,
  //screenProps: PropTypes.object.isRequired
};

export default HomeScreen;
