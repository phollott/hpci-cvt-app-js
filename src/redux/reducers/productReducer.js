import { ADD_PRODUCT, REMOVE_PRODUCT } from '../actions/actionTypes';

const initialState = {
  products: []
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCT: {
      // add en and fr
      const inProducts = action.payload.products;
      if (inProducts.length === 2) {
        const products = state.filter((product) => {
          return (
            product.nid !== inProducts[0].nid &&
            product.nid !== inProducts[1].nid
          );
        });
        return [...products, ...inProducts];
      }
      // expected en and fr
      return [...state];
    }
    case REMOVE_PRODUCT: {
      // remove en and fr
      const products = state.filter((product) => {
        return product.nid !== action.payload.nid;
      });
      return products;
    }
    default:
      return state;
  }
};

export default productReducer;
