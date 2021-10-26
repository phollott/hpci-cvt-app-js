import {
  CVT_API_URL_VACCINES,
  CVT_API_URL_NEWS,
  CVT_PORTAL,
  CVT_PORTAIL,
  NEWLY_MODIFIED_WINDOW_IN_DAYS
} from 'react-native-dotenv';

const cvtApiUrlVaccines = CVT_API_URL_VACCINES;
const cvtApiUrlNews = CVT_API_URL_NEWS;

const covidVaccinePortal = CVT_PORTAL;
const portailVaccinCovid = CVT_PORTAIL;

const covidVaccinePortalStage = 'https://covid-vaccine-stage.hpfb-dgpsa.ca';
const portailVaccinCovidStage = 'https://vaccin-covid-stage.hpfb-dgpsa.ca';

const lang = {
  english: 'en',
  french: 'fr',
  default: 'en'
};

const newlyModifiedWindowInDays = NEWLY_MODIFIED_WINDOW_IN_DAYS;

const productType = {
  vaccine: 'Vaccine',
  treatment: 'Treatment'
};

// key - value
//   bookmark-product<<nid>>-<<lang>> - product
//   expoPushToken - expoPushToken for device
//   expoPushNotification-<<notification id>> - pushNotification
//   language - en or fr
//   TODO:
//     product<<nid>>-<<lang>>: viewed
const bookmarkKeyPrefix = 'bookmark-product';
const expoPushTokenKeyPrefix = 'expoPushToken';
const expoPushNotificationKeyPrefix = 'expoPushNotification-';
const languageKeyPrefix = 'language';

export {
  cvtApiUrlVaccines,
  cvtApiUrlNews,
  covidVaccinePortal,
  portailVaccinCovid,
  covidVaccinePortalStage,
  portailVaccinCovidStage,
  lang,
  newlyModifiedWindowInDays,
  productType,
  bookmarkKeyPrefix,
  expoPushTokenKeyPrefix,
  expoPushNotificationKeyPrefix,
  languageKeyPrefix
};
