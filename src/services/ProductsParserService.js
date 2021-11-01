import { t } from 'i18n-js';
import {
  lang,
  covidVaccinePortal,
  portailVaccinCovid,
  covidVaccinePortalStage,
  portailVaccinCovidStage,
  newlyModifiedWindowInDays,
  productType
} from '../constants/constants';
import { isNil } from '../shared/util';
import {
  getDateWithTimezoneOffset,
  formatDate,
  isDateWithinDaysBefore
} from '../shared/date-fns';

// //
// Product (product: store's products.product)

const isAuthorizedProduct = (product) => {
  return (
    product.status.toLowerCase().includes('authorized') ||
    product.status.toLowerCase().includes('autorisé')
  );
};

const getProductType = (product) => {
  // productType: Vaccine or Treatment
  let prodType = 'Vaccine';
  if (!isNil(product.product_type)) {
    prodType = product.product_type.toLowerCase().startsWith('vaccin')
      ? productType.vaccine
      : productType.treatment;
  }
  return prodType;
};

const getProductLink = (product) => {
  let prodLink = '';
  if (!isNil(product.view_node)) {
    // TODO: remove replace after api or env is updated
    prodLink = product.view_node
      .replace(covidVaccinePortalStage, covidVaccinePortal)
      .replace(portailVaccinCovidStage, portailVaccinCovid);
  }
  return prodLink;
};

const getProductNote = (product) => {
  let note = '';
  if (!isNil(product.note)) {
    note = product.note.trim();
  }
  return note;
};

const getProductDateOfApproval = (product) => {
  let approvalDate = '';
  if (!isNil(product.date_of_approval)) {
    // ISO8601 compliant, e.g. "2021-04-26"
    approvalDate = product.date_of_approval;
  }
  return approvalDate;
};

const getProductDateOfApprovalFormatted = (product, language) => {
  // date_of_approval expected
  return formatDate(
    getDateWithTimezoneOffset(product.date_of_approval),
    language
  );
};

const isProductNew = (productApprovalDate) => {
  return isDateWithinDaysBefore(productApprovalDate, newlyModifiedWindowInDays);
};

const isProductUpdated = (product) => {
  let isProductResourceChanged = false;
  const resources = product.resources.filter((res) => {
    return isProductResourceForConsumers(res);
  });
  resources.forEach((res) => {
    if (isProductResourceNew(res) || isProductResourceUpdated(product, res)) {
      isProductResourceChanged = true;
    }
  });
  return isProductResourceChanged;
};

const getProductLastUpdatedDate = (product) => {
  const resources = product.resources.filter((res) => {
    return isProductResourceForConsumers(res);
  });
  const maxDate = new Date(
    Math.max(
      ...resources.map(
        (resource) => !isNil(resource.date) && new Date(resource.date)
      ),
      ...resources.map(
        (resource) =>
          !isNil(resource.updated_date) && new Date(resource.updated_date)
      )
    )
  );
  const lastUpdatedDate = getDateWithTimezoneOffset(maxDate)
    .toISOString()
    .split('T')[0]; // e.g. "2021-04-26"
  return lastUpdatedDate;
};

const isProductUnderReview = (product) => {
  return (
    product.status.toLowerCase().includes('under review') ||
    product.status.toLowerCase().includes('en cours d’examen')
  );
};

// //
// Product resource (resource: store's products.product.resource)

const isProductResourceForConsumers = (resource) => {
  return resource.audience.includes('Consumers');
};

const isProductResourceConsumerInfo = (resource) => {
  const resourceText = !isNil(resource.resourceName)
    ? resource.resourceName.toLowerCase()
    : getProductResourceName(resource).toLowerCase();
  return (
    resourceText.includes('consumer information') ||
    resourceText.includes('consommateurs')
  );
};

const getProductResourceDescription = (resource) => {
  let description = '';
  if (!isNil(resource.description)) {
    description = resource.description.replace(/(<([^>]+)>)/gi, '').trim(); // strip html, trim
  }
  return description;
};

const getProductResourceLink = (resource, language) => {
  let link = null;
  if (
    !isNil(resource.resource_link) &&
    !isNil(resource.resource_link.url) &&
    resource.resource_link.url !== ''
  ) {
    link = resource.resource_link.url; // link or null (check to display right chevron, errors if text)
    if (link.includes('?linkID')) {
      // [pmh] this is a hack because I'm not sure why these don't render correctly
      let fixedUrl =
        language === lang.english ? covidVaccinePortal : portailVaccinCovid;
      fixedUrl += link;
      link = fixedUrl;
    }
  }
  return link;
};

const getProductResourceName = (resource) => {
  let name = '';
  if (!isNil(resource.resource_link) && !isNil(resource.resource_link.text)) {
    name = resource.resource_link.text;
  }
  return name;
};

const getProductResourcePublicationStatus = (resource, language) => {
  // publicationStatus: date (formatted) or if various_dates: various or pending
  let publicationStatus = '';
  if (!isNil(resource.date)) {
    publicationStatus = formatDate(
      getDateWithTimezoneOffset(resource.date),
      language
    );
  } else if (!isNil(resource.various_dates)) {
    if (resource.various_dates.toLowerCase() === 'true') {
      publicationStatus = t(
        'productDetails.listItem.publicationStatus.various'
      );
    } else {
      publicationStatus = t(
        'productDetails.listItem.publicationStatus.pending'
      );
    }
  }
  return publicationStatus;
};

const getProductResourceType = (link) => {
  // resourceType: internal, external, pending
  let resourceType = 'pending';
  if (link) {
    if (link.includes('http:') || link.includes('https:')) {
      resourceType = 'external';
    } else {
      resourceType = 'internal';
    }
  }
  return resourceType;
};

const isProductResourceNew = (resource) => {
  let isResourceNew = false;
  if (!isNil(resource.date)) {
    isResourceNew = isDateWithinDaysBefore(
      resource.date,
      newlyModifiedWindowInDays
    );
  }
  return isResourceNew;
};

const isProductResourceUpdated = (resource) => {
  let isResourceUpdated = false;
  if (!isNil(resource.updated_date)) {
    isResourceUpdated = isDateWithinDaysBefore(
      resource.updated_date,
      newlyModifiedWindowInDays
    );
  }
  return isResourceUpdated;
};

export default {
  isAuthorizedProduct,
  getProductType,
  getProductLink,
  getProductNote,
  getProductDateOfApproval,
  getProductDateOfApprovalFormatted,
  isProductNew,
  isProductUpdated,
  getProductLastUpdatedDate,
  isProductUnderReview,
  isProductResourceForConsumers,
  isProductResourceConsumerInfo,
  getProductResourceDescription,
  getProductResourceLink,
  getProductResourceName,
  getProductResourcePublicationStatus,
  getProductResourceType,
  isProductResourceNew,
  isProductResourceUpdated
};
