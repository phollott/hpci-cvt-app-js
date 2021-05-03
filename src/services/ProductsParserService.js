import {t} from 'i18n-js';
import { lang, covidVaccinePortal, portailVaccinCovid } from '../constants/constants';
import cheerio from 'react-native-cheerio';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const WINDOW_IN_DAYS = 7;

// TODO: **** review bus req for each once api is available; priorities: product nid and type, resource updated date, etc.

////
// Product (product: store's products.product)

const isAuthorizedProduct = product => {
  return (product.status.toLowerCase().includes('authorized') || product.status.toLowerCase().includes('autorisé'));
}

const isUnauthorizedProduct = product => {
  return (!product.status.toLowerCase().includes('authorized') && !product.status.toLowerCase().includes('autorisé'));
}

const isValidProduct = product => {
  return (!product.title.toLowerCase().startsWith('demo vaccine')                                   //  TODO: **** hack! sigh
    && !product.title.toLowerCase().startsWith('new product')
    && !product.title.toLowerCase().startsWith('test')
  );
}

const getProductType = product => {
  // productType: Vaccine or Treatment
  let productType = "Vaccine";
  if (typeof product.field_product_type !== "undefined" && product.field_product_type !== null) {
    // e.g. "field_product_type": "<a href=\"https://covid-vaccine-stage.hpfb-dgpsa.ca/taxonomy/term/16\" hreflang=\"en\">Vaccine</a>"
    productType = product.field_product_type.replace(/(<([^>]+)>)/ig, "").trim();    // strip html, trim
    productType = productType.toLowerCase().startsWith("vaccin") ? "Vaccine" : "Treatment"
  }
  return productType;
}

const getProductDateOfApproval = product => {
  let approvalDate = "";
  if (typeof product.date_of_approval !== "undefined" && product.date_of_approval !== null) {
    if (product.date_of_approval.indexOf("<time ") > -1) {
      // ex: "<time datetime=\"2021-02-23T12:00:00Z\">Tue, 02/23/2021 - 12:00</time>\n"
      approvalDate = product.date_of_approval.match(/<time [^>]+>([^<]+)<\/time>/)[1];    // extract time text between > and <
      approvalDate = approvalDate.indexOf(" - ") > -1 ? approvalDate.substring(0, approvalDate.indexOf(" - ")) : approvalDate;
      approvalDate = approvalDate.indexOf(",") > -1 ? approvalDate.substring(approvalDate.indexOf(",") + 1).trim() : approvalDate;
    }
  }
  return approvalDate;
}

////
// Product resource (resource: store's products.product.resource)

const isProductResourceLinkAnAnchor = resource => {
  return (typeof resource.resource_link !== "undefined" && resource.resource_link !== null 
    && resource.resource_link.indexOf("<a") > -1
  );
}

const getProductResourceDescription = resource => {
  let description = "";
  if (typeof resource.description !== "undefined" && resource.description !== null) {
    description = resource.description.replace(/(<([^>]+)>)/ig, "").trim();    // strip html, trim
  }
  return description;
}

const getProductResourceLink = (resource, language) => {
  let link = null;
  if (isProductResourceLinkAnAnchor(resource)) {
    link = resource.resource_link.match(/href="([^"]*)/)[1];    // link or null (check to display right chevron, errors if text)
    if (link.includes("?linkID")) {                             // [pmh] this is a hack because I'm not sure why these don't render correctly
      var fixedUrl = (language === lang.english) ? covidVaccinePortal : portailVaccinCovid;
      fixedUrl += link;
      link = fixedUrl;
    }
  }
  return link;
}

const getProductResourceName = resource => {
  let name = "";
  if (isProductResourceLinkAnAnchor(resource)) {
    name = resource.resource_link.match(/<a [^>]+>([^<]+)<\/a>/)[1];    // extract anchor text between > and <
  }
  return name;
}

const getProductResourcePublicationStatus = resource => {
  let publicationStatus = "";
  if (typeof resource.various_dates !== "undefined" && resource.various_dates !== null) {
    // publicationStatus: various, pending, or date (formatted)
    publicationStatus = 
      resource.various_dates.toLowerCase() === "yes" 
        ? t('productDetails.listItem.publicationStatus.various') 
        : (typeof resource.date !== "undefined" && resource.date !== null)
          ? resource.date.match(/<time [^>]+>([^<]+)<\/time>/)[1]    // extract time text between > and <
          : t('productDetails.listItem.publicationStatus.pending');

    if (!publicationStatus.includes( t('productDetails.listItem.publicationStatus.various') ) 
      && !publicationStatus.includes( t('productDetails.listItem.publicationStatus.pending') )
    ){
      publicationStatus = publicationStatus.indexOf(" - ") > -1 ? publicationStatus.substring(0, publicationStatus.indexOf(" - ")) : publicationStatus;
      publicationStatus = publicationStatus.indexOf(",") > -1 ? publicationStatus.substring(publicationStatus.indexOf(",") + 1).trim() : publicationStatus;
    }
  }
  return publicationStatus;
}

const getProductResourceType = link => {
  // resourceType: internal, external, pending
  let resourceType = "pending";
  if (link) {
    if (link.includes("http:") || link.includes("https:")) {
      resourceType = "external";
    } else {
      resourceType = "internal";
    } 
  }
  return resourceType;
}

const isProductResourceNew = resource => {
  // TODO
  //  This is not very well tested, and I would not be surprised if it is off by one
  if (resource.date) {
    var $ = cheerio.load(resource.date),
      dtraw = new Date($('time').attr('datetime')),
      dtutc = Date.UTC(dtraw.getFullYear(), dtraw.getMonth()+1, dtraw.getDate()),
      dtdif = Math.floor((Date.now() - dtutc) / MS_PER_DAY);
    return (dtdif <= WINDOW_IN_DAYS);
  }
  return false;
}

const isProductResourceUpdated = (product, resource) => {
  // TODO 
  //   api updated: Updated Date is with product in product.field_vaccine_resources (look for div with field--name-field-updated-date)
  //   e.g. see "nid" : "26" and look deep within field_vaccine_resources:
  /*
  <div class="field field--name-field-updated-date field--type-datetime field--label-above">
    <div class="field--label">Updated Date</div>
      <div class="field--item"><time datetime="2021-03-03T12:12:12Z">Wed, 03/03/2021 - 12:12</time>
    </div>
  </div>
  //   note: the above is from nid 26, en version, and is not in fr version (20210430 snapshot from staging)
  */
  //console.log("product's field_vaccine_resources: ", product.field_vaccine_resources);
  return false;
}

export default {
  isAuthorizedProduct,
  isUnauthorizedProduct,
  isValidProduct,
  getProductType,
  getProductDateOfApproval,
  isProductResourceLinkAnAnchor,
  getProductResourceDescription,
  getProductResourceLink,
  getProductResourceName,
  getProductResourcePublicationStatus,
  getProductResourceType,
  isProductResourceNew,
  isProductResourceUpdated
};
