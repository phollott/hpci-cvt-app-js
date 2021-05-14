import { selectLanguageText } from './settingsSelector';
import { productsParser } from '../../services';

export function selectProducts(state) {
  return state.products.filter(product => {
    return product.language == selectLanguageText(state)
      && productsParser.isAuthorizedProduct(product)
  });
};

export function selectProductByID(state, nid) {
  return state.products.filter(product => {
    return product.nid == nid
      && product.language == selectLanguageText(state)
      && productsParser.isAuthorizedProduct(product)
  })[0]; // expect 1 product
};

export function selectProductsByID(state, nid) {
  return state.products.filter(product => {
    return product.nid == nid
      && productsParser.isAuthorizedProduct(product)
  }); // both en and fr for nid
};
