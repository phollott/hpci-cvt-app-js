import { selectLanguageText } from './settingsSelector';

export function selectBookmarks(state) {
  return state.bookmarks.filter(bookmark => {
    return bookmark.language == selectLanguageText(state)
  });
};

export function selectBookmarkByID(state, nid) {
  return state.bookmarks.filter(bookmark => {
    return bookmark.nid == nid
      && bookmark.language == selectLanguageText(state)
  })[0]; // expect 1 bookmark
};

export function selectBookmarksByID(state, nid) {
  return state.bookmarks.filter(bookmark => {
    return bookmark.nid == nid
  }); // both en and fr for nid
};

export function selectBookmarkExists(state, nid) {
  const match = bookmark => bookmark.nid == nid && selectLanguageText(state);
  return state.bookmarks.some(match);
}
