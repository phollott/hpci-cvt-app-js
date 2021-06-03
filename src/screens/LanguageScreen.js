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
import { storage } from '../services';
import i18n, {t} from 'i18n-js';
import Touch from '../components/Touch';
import ViewCardText from '../components/ViewCardText';

const LanguageScreen = ({ navigation }) => { 
  const theme = useTheme();
  const colorScheme = useColorScheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const languageViewKey = language + "LanguageView";

  const dispatch = useDispatch();
  const setLang = lang => dispatch(setLanguage(lang));

  const setLanguagePreference = async (value) => {
    try {
      i18n.locale = value;                    // t
      setLang(value);                         // redux
      await storage.save('language', value);  // persist
    } catch (error) {
      console.log('Unable to set language preference. ', error);
    }
  }

// [mrj] hack: navigation is used to ensure the tab stacks, product resource webview and this screen are re-rendered after language is changed

// [pmh] this method of uapplying dark mode should work with RNE, but is untested

  return (
    <ThemeProvider theme={ gStyle.mytheme } useDark={ colorScheme === 'dark' }>

      <View style={gStyle.container[theme]} key={languageViewKey}>
        <ScrollView contentContainerStyle={gStyle.contentContainer}>
          <ViewCardText title={ t('home.settings.language.title') } />
          <View style={gStyle.spacer32} />
          <View style={{ width: '90%', justifyContent: 'center' }}>
            <Touch
              onPress={() => {
                setLanguagePreference(lang.english);
                navigation.navigate('ProductsStack', {screen: 'Products'});
                navigation.navigate('BookmarksStack', {screen: 'Bookmarks'});
                navigation.navigate('HomeStack', {screen: 'Language'});
              }}
              text={ t('home.settings.language.touchText', {locale: 'en'}) }
              rIconName={ (language === lang.english) ? 'check' : null }
            />
            <Touch
              onPress={() => {
                setLanguagePreference(lang.french);
                navigation.navigate('ProductsStack', {screen: 'Products'});
                navigation.navigate('BookmarksStack', {screen: 'Bookmarks'});
                navigation.navigate('HomeStack', {screen: 'Language'});
              }}
              text={ t('home.settings.language.touchText', {locale: 'fr'}) }
              rIconName={ (language === lang.french) ? 'check' : null }
            />
          </View>
          <View style={gStyle.spacer32} />
        </ScrollView>
      </View>
      
    </ThemeProvider>
  );
};

LanguageScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default LanguageScreen;
