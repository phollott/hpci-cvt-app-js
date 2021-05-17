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

const mapProduct = (product, id) => {
  let prod = productMaster(product, id);
  prod.showLink = true;
  prod.searchKey = [prod.brandName, prod.companyName, prod.ingredient].join('-').toLowerCase();
  prod.isNew = ProductsParserService.isProductNew(prod.approvalDate);
  prod.isUpdated = ProductsParserService.isProductUpdated(product);
  return prod;
}

export default {
  mapProduct
};
