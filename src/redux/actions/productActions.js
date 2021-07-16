import { ADD_PRODUCT, REMOVE_PRODUCT } from './actionTypes';

export function addProduct(inProducts) {
  return {
    type: ADD_PRODUCT,
    payload: { products: inProducts }
  };
}

export function removeProduct(id) {
  return {
    type: REMOVE_PRODUCT,
    payload: { nid: id }
  };
}
