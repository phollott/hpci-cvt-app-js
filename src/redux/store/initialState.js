import { lang } from '../../constants/constants';

const initialState = {
  bookmarks: [],
  products: [],
  settings: {
    language: lang.default,
    isOnline: true
  }
};

export default initialState;
