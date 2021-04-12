import * as React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { Card, ThemeProvider } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setLanguage } from '../redux/actions/settingsActions';
import { gStyle } from '../constants';
import { lang } from '../constants/constants';
import { useColorScheme } from 'react-native-appearance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, {t} from 'i18n-js';

// components
import Touch from '../components/Touch';

//const HomeScreen = ({ navigation, screenProps }) => {
const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const homeScreenKey = language + "HomeScreen";

  const dispatch = useDispatch();
  const setLang = lang => dispatch(setLanguage(lang));

  const setLanguagePreference = async (value) => {
    try {
      i18n.locale = value;                            // t
      setLang(value);                                 // redux
      await AsyncStorage.setItem('language', value);  // persist
    } catch (error) {
      console.log('Unable to set language preference.', error);
    }
  }

// [pmh] this method of uapplying dark mode should work with RNE, but is untested

  return (
    <ThemeProvider theme={ gStyle.mytheme } useDark={ colorScheme === 'dark' }>

      <View style={gStyle.container[theme]} key={homeScreenKey}>
        <ScrollView contentContainerStyle={gStyle.contentContainer}>
          <View style={{ width: '100%', justifyContent: 'center' }}>
            <Card>
              <Text style={gStyle.text[theme], {fontSize: 16}}>{ t('home.introText') }</Text>
            </Card>
          </View>
          <View style={gStyle.spacer64} />
          <Touch
            onPress={() => {
              setLanguagePreference(lang.english);
              navigation.navigate('ProductsStack', {screen: 'Products'});
            }}
            text={ t('home.products.touchText', {locale: 'en'}) }
          />
          <Touch
            onPress={() => {
              setLanguagePreference(lang.french);
              navigation.navigate('ProductsStack', {screen: 'Products'});
            }}
            text={ t('home.products.touchText', {locale: 'fr'}) }
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
