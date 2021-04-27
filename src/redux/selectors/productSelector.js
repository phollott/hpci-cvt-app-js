import { selectLanguageText } from './settingsSelector';

// TODO: **** get bus req for both products selectors, refactor bus rules

export function selectAuthorizedProducts(state) {
  return state.products.filter(item => {
    return item.language == selectLanguageText(state)
      && (item.status.toLowerCase().includes('authorized') || item.status.toLowerCase().includes('autorisé'))
  });
};

export function selectUnauthorizedProducts(state) {
  return state.products.filter(item => {
    return item.language == selectLanguageText(state)
      && !item.status.toLowerCase().includes('authorized') && !item.status.toLowerCase().includes('autorisé')
      && !item.title.toLowerCase().startsWith('demo vaccine')                                                    //  TODO: **** hack! sigh
      && !item.title.toLowerCase().startsWith('new product')
      && !item.title.toLowerCase().startsWith('test')
  });
};

export function selectProductByID(state, nid) {
  return state.products.filter(item => {
    return item.nid == nid
      && item.language == selectLanguageText(state)
  })[0]; // expect 1 product
};
