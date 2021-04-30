import { selectLanguageText } from './settingsSelector';
import { productsParser } from '../../services';

export function selectAuthorizedProducts(state) {
  return state.products.filter(product => {
    return product.language == selectLanguageText(state)
      && productsParser.isAuthorizedProduct(product)
  });
};

export function selectUnauthorizedProducts(state) {
  return state.products.filter(product => {
    return product.language == selectLanguageText(state)
      && productsParser.isUnauthorizedProduct(product)
      && productsParser.isValidProduct(product)
  });
};

export function selectProductByID(state, nid) {
  return state.products.filter(product => {
    return product.nid == nid
      && product.language == selectLanguageText(state)
  })[0]; // expect 1 product
};
