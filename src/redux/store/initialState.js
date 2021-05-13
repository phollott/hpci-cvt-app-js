import { lang } from '../../constants/constants';

let initialState =  {
  bookmarks : [],
  products : [],
  settings : {
    language : lang.default,
    isOnline : true
  }
};

export default initialState;
