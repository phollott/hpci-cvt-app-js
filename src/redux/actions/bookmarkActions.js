import { ADD_BOOKMARK, REMOVE_BOOKMARK } from './actionTypes';

export function addBookmark(inBookmarks) {
  return {
    type: ADD_BOOKMARK,
    payload: { bookmarks: inBookmarks }
  };
}

export function removeBookmark(id) {
  return {
    type: REMOVE_BOOKMARK,
    payload: { nid: id }
  };
}
