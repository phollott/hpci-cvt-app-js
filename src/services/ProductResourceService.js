import ProductsParserService from './ProductsParserService';

let productResource = (resource, id) => {
  return {
    key: id,
    id: resource.id,
    link: null,
    resourceType: "pending",
    audience: resource.audience.toString(),
    resourceName: ProductsParserService.getProductResourceName(resource),
    description: ProductsParserService.getProductResourceDescription(resource),
    publicationStatus: ProductsParserService.getProductResourcePublicationStatus(resource),
    isNew: false,
    isUpdated: false
  };
}

const mapProductResource = (product, resource, id, language) => {
  let res = productResource(resource, id);
  res.link = ProductsParserService.getProductResourceLink(resource, language);
  res.resourceType = ProductsParserService.getProductResourceType(res.link);
  res.isNew = ProductsParserService.isProductResourceNew(resource);
  res.isUpdated = ProductsParserService.isProductResourceUpdated(product, resource);
  return res;
}

const mapProductResources = (product, language) => {
  var resourceList = [];
  product.resources.forEach((resource, i) => {
    if (resource.audience.includes("Consumers")) {
      resourceList.push(mapProductResource(product, resource, i, language));
    }
  });
  return resourceList;
}

export default {
  mapProductResources
};
