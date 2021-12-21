import { lang } from '../../constants/constants';

const initialState = {
  bookmarks: [],
  products: [],
  settings: {
    language: lang.default,
    isOnline: true,
    notifications: {
      enabled: true,
      newProducts: true,
      bookmarkedProducts: true
    }
  }
};

export default initialState;
