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
    isNew: ProductsParserService.isProductResourceNew(resource),
    isUpdated: ProductsParserService.isProductResourceUpdated(resource)
  };
}

const mapProductResource = (resource, id, language) => {
  let aResource = productResource(resource, id);
  aResource.link = ProductsParserService.getProductResourceLink(resource, language);
  aResource.resourceType = ProductsParserService.getProductResourceType(aResource.link);
  return aResource;
}

export default {
  mapProductResource
};
