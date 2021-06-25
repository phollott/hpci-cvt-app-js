import { ADD_BOOKMARK, REMOVE_BOOKMARK } from '../actions/actionTypes';

const initialState = {
  bookmarks: []
};

const bookmarkReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BOOKMARK: {
      // add en and fr
      const inBookmarks = action.payload.bookmarks;
      if (inBookmarks.length === 2) {
        const bookmarks = state.filter((bkmark) => {
          return (
            bkmark.nid !== inBookmarks[0].nid &&
            bkmark.nid !== inBookmarks[1].nid
          );
        });
        return [...bookmarks, ...inBookmarks];
      }
      // expected en and fr
      return [...state];
    }
    case REMOVE_BOOKMARK: {
      // remove en and fr
      const bookmarks = state.filter((bookmark) => {
        return bookmark.nid !== action.payload.nid;
      });
      return bookmarks;
    }
    default:
      return state;
  }
};

export default bookmarkReducer;
