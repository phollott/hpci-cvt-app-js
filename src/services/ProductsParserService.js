import { t } from 'i18n-js';
import cheerio from 'react-native-cheerio';
import {
  lang,
  covidVaccinePortal,
  portailVaccinCovid,
  productType
} from '../constants/constants';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const WINDOW_IN_DAYS = 7;
const EN_MONTH = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
const FR_MONTH = 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_decembre'.split('_');

const isNil = (value) => {
  return typeof value === 'undefined' || value === null;
};

// TODO: **** review bus req for each once api is available

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
  if (!isNil(product.field_product_type)) {
    // e.g. "field_product_type": "<a href=\"https://covid-vaccine-stage.hpfb-dgpsa.ca/taxonomy/term/16\" hreflang=\"en\">Vaccine</a>"
    prodType = product.field_product_type.replace(/(<([^>]+)>)/gi, '').trim(); // strip html, trim
    prodType = prodType.toLowerCase().startsWith('vaccin')
      ? productType.vaccine
      : productType.treatment;
  }
  return prodType;
};

const getProductDateOfApproval = (product) => {
  let approvalDate = '';
  if (!isNil(product.date_of_approval)) {
    if (product.date_of_approval.indexOf('<time ') > -1) {
      // ex: "<time datetime=\"2021-02-23T12:00:00Z\">Tue, 02/23/2021 - 12:00</time>\n"
      approvalDate = product.date_of_approval.match(/<time [^>]+>([^<]+)<\/time>/)[1]; // extract time text between > and <
      approvalDate =
        approvalDate.indexOf(' - ') > -1
          ? approvalDate.substring(0, approvalDate.indexOf(' - '))
          : approvalDate;
      approvalDate =
        approvalDate.indexOf(',') > -1
          ? approvalDate.substring(approvalDate.indexOf(',') + 1).trim()
          : approvalDate;
    }
  }
  return approvalDate;
};

const getProductDateOfApprovalISO = (product) => {
  let approvalDate = '';
  if (!isNil(product.date_of_approval)) {
    if (product.date_of_approval.indexOf('<time ') > -1) {
      // ex: "<time datetime=\"2021-02-23T12:00:00Z\">Tue, 02/23/2021 - 12:00</time>\n"
      const $ = cheerio.load(product.date_of_approval);
      approvalDate = $('time').attr('datetime').substring(0, 10);
    }
  }
  return approvalDate;
};

const getProductDateOfApprovalFormatted = (product, language) => {
  return getFormattedDateFromHtml(product.date_of_approval, language);
};

const getFormattedDateFromHtml = (htmlDateTime, language) => {
  let formattedDate = '';
  if (!isNil(htmlDateTime)) {
    if (htmlDateTime.indexOf('<time ') > -1) {
      // ex: "<time datetime=\"2021-02-23T12:00:00Z\">Tue, 02/23/2021 - 12:00</time>\n"
      const $ = cheerio.load(htmlDateTime);
      const dtraw = new Date($('time').attr('datetime'));
      switch (language) {
        case lang.english:
          formattedDate = EN_MONTH[dtraw.getMonth()] + ' ' + dtraw.getDate() + ', ' + dtraw.getFullYear();
          break;
        case lang.french:
          formattedDate = dtraw.getDate() + ' ' + FR_MONTH[dtraw.getMonth()] + ' ' + dtraw.getFullYear();
          break;
        default:
          formattedDate = $('time').attr('datetime').substring(0, 10);
      }
    }
  }
  return formattedDate;
};

// TODO
//  This is not very well tested, and I would not be surprised if it is inaccurate
const isProductNew = (productApprovalDate) => {
  const dtraw = new Date(productApprovalDate);
  const dtutc = Date.UTC(
    dtraw.getFullYear(),
    dtraw.getMonth(),
    dtraw.getDate()
  );
  const dtdif = Math.floor((Date.now() - dtutc) / MS_PER_DAY);
  return dtdif <= WINDOW_IN_DAYS;
};

// TODO
//  This is not very well tested, and I would not be surprised if it is inaccurate
const isProductUpdated = (product) => {
  let isProductResourceChanged = false;
  const resources = product.resources.filter((res) => {
    return res.audience.indexOf('Consumers') !== -1;
  });
  resources.forEach((res) => {
    if (isProductResourceNew(res) || isProductResourceUpdated(product, res)) {
      isProductResourceChanged = true;
    }
  });
  return isProductResourceChanged;
};

// //
// Product resource (resource: store's products.product.resource)

const isProductResourceLinkAnAnchor = (resource) => {
  return (
    !isNil(resource.resource_link) && resource.resource_link.indexOf('<a') > -1
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
  if (isProductResourceLinkAnAnchor(resource)) {
    link = resource.resource_link.match(/href="([^"]*)/)[1]; // link or null (check to display right chevron, errors if text)
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
  if (isProductResourceLinkAnAnchor(resource)) {
    name = resource.resource_link.match(/<a [^>]+>([^<]+)<\/a>/)[1]; // extract anchor text between > and <
  }
  return name;
};

const getProductResourcePublicationStatus = (resource, language) => {
  let publicationStatus = '';
  if (!isNil(resource.various_dates)) {
    // publicationStatus: various, pending, or date (formatted)
    if (resource.various_dates.toLowerCase() === 'yes') {
      publicationStatus = t(
        'productDetails.listItem.publicationStatus.various'
      );
    } else {
      publicationStatus = !isNil(resource.date)
        ? getFormattedDateFromHtml(resource.date, language)
        : t('productDetails.listItem.publicationStatus.pending');
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

const isProductResourceNameConsumerInfo = (resourceName) => {
  return (
    resourceName.toLowerCase().includes('consumer information') ||
    resourceName.toLowerCase().includes('consommateurs')
  );
};

const isProductResourceNew = (resource) => {
  // TODO
  //  This is not very well tested, and I would not be surprised if it is off by one
  let isResourceNew = false;
  if (resource.date) {
    // console.log ('NEW Res --> ' + resource.resource_link)
    const $ = cheerio.load(resource.date);
    const dtraw = new Date($('time').attr('datetime'));
    const dtutc = Date.UTC(
      dtraw.getFullYear(),
      dtraw.getMonth(),
      dtraw.getDate()
    );
    const dtdif = Math.floor((Date.now() - dtutc) / MS_PER_DAY);
    isResourceNew = dtdif <= WINDOW_IN_DAYS;
    // console.log($('time').attr('datetime'));
    // console.log('New Date Difference: ' + Date.now() + '-' + dtutc + '=' + dtdif + ' : ' + isResourceNew);
  }
  return isResourceNew;
};

const isProductResourceUpdated = (product, resource) => {
  // TODO
  //  This is not very well tested, and I would not be surprised if it is off by one
  let isResourceUpdated = false;
  if (product.field_vaccine_resources_export_1) {
    const $ = cheerio.load(product.field_vaccine_resources_export_1);
    $('div.paragraph--type--vaccine-resources').map((i, el_outer) => {
      let match = null;
      let dtraw = null;
      $(el_outer)
        .find('div.field')
        .map((j, el_inner) => {
          // Inner loop is iterates over all of the Resource Details
          const fieldItem = $(el_inner).find('div.field--item').html();
          switch ($(el_inner).find('div.field--label').text()) {
            case 'Updated Date':
              dtraw = new Date($(fieldItem).attr('datetime'));
              break;
            case 'Resource link':
              if (fieldItem === resource.resource_link) {
                match = true;
              }
              break;
            default:
              break;
          }
        });

      // At this point, we have iterated over the Resource Details
      if (match && dtraw) {
        const dtutc = Date.UTC(
          dtraw.getFullYear(),
          dtraw.getMonth(),
          dtraw.getDate()
        );
        const dtdif = Math.floor((Date.now() - dtutc) / MS_PER_DAY);
        if (dtdif <= WINDOW_IN_DAYS) {
          isResourceUpdated = true;
        }
        // console.log('Updated Date Difference for : ' + resource.description + ' : ' + dtdif + ' : ' + isResourceUpdated);
      }
    });
  }
  return isResourceUpdated;
};

export default {
  isAuthorizedProduct,
  getProductType,
  getProductDateOfApproval,
  getProductDateOfApprovalISO,
  getProductDateOfApprovalFormatted,
  isProductNew,
  isProductUpdated,
  isProductResourceLinkAnAnchor,
  getProductResourceDescription,
  getProductResourceLink,
  getProductResourceName,
  getProductResourcePublicationStatus,
  getProductResourceType,
  isProductResourceNameConsumerInfo,
  isProductResourceNew,
  isProductResourceUpdated,
  getFormattedDateFromHtml
};
