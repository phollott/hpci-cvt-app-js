import { lang } from '../constants/constants';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const EN_MONTH =
  'January_February_March_April_May_June_July_August_September_October_November_December'.split(
    '_'
  );
const FR_MONTH =
  'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_decembre'.split(
    '_'
  );

const compareDesc = (a, b) => {
  return a.date > b.date ? -1 : 1;
};

const getDate = () => {
  return new Date();
};

const getTimeInMillis = () => {
  return Date.now(); // time in millis since Unix Epoch, UTC
};

const getDateWithTimezoneOffset = (date) => {
  const dt = new Date(date);
  return new Date(dt.getTime() + dt.getTimezoneOffset() * 60000);
};

const getUTCDate = (date) => {
  const dt = new Date(date);
  const dtutc = Date.UTC(
    dt.getUTCFullYear(),
    dt.getUTCMonth(),
    dt.getUTCDate()
  );
  return dtutc;
};

const isDateWithinDaysBefore = (date, days) => {
  const dtdif = Math.floor((getTimeInMillis() - getUTCDate(date)) / MS_PER_DAY);
  return dtdif <= days;
};

const formatDate = (date, language) => {
  // date: Date expected
  let dtfmt = '';
  switch (language) {
    case lang.english:
      dtfmt = ''
        .concat(EN_MONTH[date.getMonth()])
        .concat(' ')
        .concat(date.getDate())
        .concat(', ')
        .concat(date.getFullYear());
      break;
    case lang.french:
      dtfmt = ''
        .concat(date.getDate())
        .concat(' ')
        .concat(FR_MONTH[date.getMonth()])
        .concat(' ')
        .concat(date.getFullYear());
      break;
    default:
      dtfmt = date.substring(0, 10);
  }
  return dtfmt;
};

export {
  compareDesc,
  getDate,
  getTimeInMillis,
  getDateWithTimezoneOffset,
  getUTCDate,
  isDateWithinDaysBefore,
  formatDate
};
