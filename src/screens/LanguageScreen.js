import * as React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import i18n, { t } from 'i18n-js';
import { setLanguage } from '../redux/actions/settingsActions';
import { gStyle } from '../constants';
import { lang } from '../constants/constants';
import { languageStorage, notifications } from '../services';
import Touch from '../components/Touch';
import ViewCardText from '../components/ViewCardText';

const LanguageScreen = ({ navigation }) => {
  const theme = useTheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const languageViewKey = language.concat('LanguageView');

  const dispatch = useDispatch();
  const setLang = (value) => dispatch(setLanguage(value));

  const setLanguagePreference = async (value) => {
    try {
      i18n.locale = value; // t
      setLang(value); // redux
      await languageStorage.saveLanguage(value); // persist
      notifications.dispatchPreferencesAndSync(value); // pns
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Unable to set language preference. ', error);
    }
  };

  const navStacks = () => {
    // hack: navigation is used to ensure screens are re-rendered after language is changed
    navigation.navigate('ProductsStack', { screen: 'Products' });
    navigation.navigate('BookmarksStack', { screen: 'Bookmarks' });
    navigation.navigate('HomeStack', { screen: 'Language' });
  };

  return (
    <View style={gStyle.container[theme]} key={languageViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <ViewCardText title={t('home.settings.language.title')} />
        <View style={gStyle.spacer32} />
        <View style={{ width: '90%', justifyContent: 'center' }}>
          <Touch
            onPress={() => {
              setLanguagePreference(lang.english).then(navStacks());
            }}
            text={t('home.settings.language.touchText', { locale: 'en' })}
            rIconName={language === lang.english ? 'check' : null}
          />
          <Touch
            onPress={() => {
              setLanguagePreference(lang.french).then(navStacks());
            }}
            text={t('home.settings.language.touchText', { locale: 'fr' })}
            rIconName={language === lang.french ? 'check' : null}
          />
        </View>
        <View style={gStyle.spacer32} />
      </ScrollView>
    </View>
  );
};

LanguageScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default LanguageScreen;
