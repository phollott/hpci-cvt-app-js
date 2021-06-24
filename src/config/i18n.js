import i18n from 'i18n-js';
import en from './language/en';
import fr from './language/fr';

// config for i18n

// fallback to another language with the key present when the value is missing (e.g. en-CA -> en)
i18n.fallbacks = true;

// default to en when current locale in device is not en or fr
i18n.defaultLocale = 'en';

// set the key-value pairs for the supported languages
i18n.translations = {
  en,
  fr
};

export const setLocale = (locale) => {
  i18n.locale = locale.startsWith('fr') ? 'fr' : 'en';
};

export const getCurrentLocale = () => i18n.locale;

/*
examples:

en.js:
  home: {
    welcome: "Hello",
    name: "CVT App (%{language})",
    settings: {
      language: {
        touchText: "English (Canada)"
      }
    },
    ...
  }
  ----
  import { t } from 'i18n-js';

  //home.welcome and home.name with interpolated value - en locale
  console.log( t('home.welcome') + ' ' + t('home.name', {language: 'English'}) );
  > Hello CVT App (English)

  //show french home.settings.language.touchText with en locale
  console.log( t('home.settings.language.touchText', {locale: 'fr'}) );
  > Français (Canada)

tip: put a space before  t(' for easy finds
                        ^
*/
