import { lang } from '../constants/constants';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const WINDOW_IN_DAYS = 7;
const EN_MONTH = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
const FR_MONTH = 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_decembre'.split('_');

const compareDesc = (a, b) => {
  return a.date > b.date ? -1 : 1;
};

const getCurrentDate = () => {
  return new Date();
};

const getCurrentTimeInMillis = () => {
  return getCurrentDate().getTime(); // time in millis since Unix Epoch, UTC
};

const getDateWithTimezoneOffset = (isoDate) => {
  // expected format: YYYY-MM-DD
  const date = new Date(isoDate);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

const getFormattedDate = (dtraw, language) => {
  // dtraw: Date expected
  let formattedDate = '';
  switch (language) {
    case lang.english:
      formattedDate = ''
        .concat(EN_MONTH[dtraw.getMonth()])
        .concat(' ')
        .concat(dtraw.getDate())
        .concat(', ')
        .concat(dtraw.getFullYear());
      break;
    case lang.french:
      formattedDate = ''
        .concat(dtraw.getDate())
        .concat(' ')
        .concat(FR_MONTH[dtraw.getMonth()])
        .concat(' ')
        .concat(dtraw.getFullYear());
      break;
    default:
      formattedDate = dtraw.substring(0, 10);
  }
  return formattedDate;
};

const isDateWithinWindow = (dt) => {
  const dtraw = new Date(dt);
  const dtutc = Date.UTC(
    dtraw.getFullYear(),
    dtraw.getMonth(),
    dtraw.getDate()
  );
  const dtdif = Math.floor((Date.now() - dtutc) / MS_PER_DAY);
  // console.log(dt);
  // console.log('Date Difference: ' + Date.now() + '-' + dtutc + '=' + dtdif + ' : ' + dtdif <= WINDOW_IN_DAYS);
  return dtdif <= WINDOW_IN_DAYS;
};

export {
  compareDesc,
  getCurrentDate,
  getCurrentTimeInMillis,
  getDateWithTimezoneOffset,
  getFormattedDate,
  isDateWithinWindow
};
