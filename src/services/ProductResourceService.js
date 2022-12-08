import ProductsParserService from './ProductsParserService';

const productResource = (resource, id, language) => {
  return {
    key: id,
    id: resource.id,
    link: null,
    resourceType: 'pending',
    audience: resource.audience.toString(),
    resourceName: ProductsParserService.getProductResourceName(resource),
    description: ProductsParserService.getProductResourceDescription(resource),
    publicationStatus:
      ProductsParserService.getProductResourcePublicationStatus(
        resource,
        language
      ),
    isNew: false,
    isUpdated: false
  };
};

const mapProductResource = (resource, id, language) => {
  const res = productResource(resource, id, language);
  res.link = ProductsParserService.getProductResourceLink(resource, language);
  res.resourceType = ProductsParserService.getProductResourceType(res.link);
  res.isNew = ProductsParserService.isProductResourceNew(resource);
  res.isUpdated = ProductsParserService.isProductResourceUpdated(resource);
  return res;
};

const mapProductResources = (product, language) => {
  const resourceList = [];
  product.resources.forEach((resource, i) => {
    if (ProductsParserService.isProductResourceForConsumers(resource)) {
      resourceList.push(mapProductResource(resource, i, language));
    }
  });
  return resourceList;
};

export default {
  mapProductResources
};
