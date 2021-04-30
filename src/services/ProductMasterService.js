import ProductsParserService from './ProductsParserService';

let productMaster = (product, id) => {
  return {
    key: id,
    nid: product.nid,
    brandName: product.brand_name,
    ingredient: product.ingredient, 
    companyName: product.company_name,
    type: ProductsParserService.getProductType(product),
    status: product.status, 
    approvalDate: ProductsParserService.getProductDateOfApproval(product),
    showLink: false,
    searchKey: ''
  };
}

const mapAuthorizedProduct = (product, id) => {
  let authorizedProduct = productMaster(product, id);
  authorizedProduct.showLink = true;
  authorizedProduct.searchKey = [authorizedProduct.brandName, authorizedProduct.companyName, authorizedProduct.ingredient].join('-').toLowerCase();
  return authorizedProduct;
}

const mapUnauthorizedProduct = (product, id) => {
  let unauthorizedProduct = productMaster(product, id);
  unauthorizedProduct.showLink = false;
  unauthorizedProduct.searchKey = [unauthorizedProduct.brandName, unauthorizedProduct.companyName].join('-').toLowerCase();
  return unauthorizedProduct;
}

export default {
  mapAuthorizedProduct,
  mapUnauthorizedProduct
};
