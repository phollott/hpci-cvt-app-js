import * as React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
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

const MenuScreen = ({ navigation }) => {
//const MenuScreen = () => {  
  const theme = useTheme();
  const colorScheme = useColorScheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const menuViewKey = language + "MenuView";

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

// [mrj] this menu screen and settings is not done.  For now, it just shows the en/fr buttons and works like before... 
//       though I also added the navigation goBack to keep this menu screen from appearing when Home is selected (wip)

  return (
    <ThemeProvider theme={ gStyle.mytheme } useDark={ colorScheme === 'dark' }>

      <View style={gStyle.container[theme]} key={menuViewKey}>
        <ScrollView contentContainerStyle={gStyle.contentContainer}>
          <View style={{ width: '75%', justifyContent: 'center' }}>
            <View style={gStyle.spacer32} />
            <Touch
              onPress={() => {
                setLanguagePreference(lang.english);
                navigation.goBack();
                navigation.navigate('ProductsStack', {screen: 'Products'});
              }}
              text={ t('home.products.touchText', {locale: 'en'}) }
            />
            <Touch
              onPress={() => {
                setLanguagePreference(lang.french);
                navigation.goBack();
                navigation.navigate('ProductsStack', {screen: 'Products'});
              }}
              text={ t('home.products.touchText', {locale: 'fr'}) }
            />
            </View>
          <View style={gStyle.spacer32} />
        </ScrollView>
      </View>
      
    </ThemeProvider>
  );
};

MenuScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired //,
  //screenProps: PropTypes.object.isRequired
};

export default MenuScreen;
