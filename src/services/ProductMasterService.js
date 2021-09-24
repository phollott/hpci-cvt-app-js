import ProductsParserService from './ProductsParserService';

const productMaster = (product, id, language) => {
  return {
    key: id,
    nid: product.nid,
    brandName: product.brand_name,
    ingredient: product.ingredient,
    companyName: product.company_name,
    type: ProductsParserService.getProductType(product),
    status: product.status,
    approvalDate: ProductsParserService.getProductDateOfApproval(product),
    approvalDateFormatted: ProductsParserService.getProductDateOfApprovalFormatted(
      product,
      language
    ),
    productLink: ProductsParserService.getProductLink(product),
    note: ProductsParserService.getProductNote(product),
    showLink: false,
    searchKey: '',
    isNew: false,
    isUpdated: false,
    isBookmark: false,
    productMetadata: [],
    consumerInformation: [],
    regulatoryAnnouncements: [] // productMetadata, consumerInformation and regulatoryAnnouncements are set for bookmarks, used when !isOnline
  };
};

const mapProduct = (product, id, language, isBookmark = false) => {
  const prod = productMaster(product, id, language);
  prod.showLink = true;
  prod.searchKey = [prod.brandName, prod.companyName, prod.ingredient]
    .join('-')
    .toLowerCase();
  prod.isNew = ProductsParserService.isProductNew(prod.approvalDate);
  prod.isUpdated = ProductsParserService.isProductUpdated(product);
  prod.isBookmark = isBookmark;
  return prod;
};

export default {
  mapProduct
};
