import {t} from 'i18n-js';
import { lang, covidVaccinePortal, portailVaccinCovid, productType } from '../constants/constants';
import cheerio from 'react-native-cheerio';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const WINDOW_IN_DAYS = 7;
const EN_MONTH = "January_February_March_April_May_June_July_August_September_October_November_December".split('_');
const FR_MONTH = "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_decembre".split('_');


// TODO: **** review bus req for each once api is available

////
// Product (product: store's products.product)

const isAuthorizedProduct = product => {
  return (product.status.toLowerCase().includes('authorized') || product.status.toLowerCase().includes('autorisé'));
}

const getProductType = product => {
  // productType: Vaccine or Treatment
  let prodType = "Vaccine";
  if (typeof product.field_product_type !== "undefined" && product.field_product_type !== null) {
    // e.g. "field_product_type": "<a href=\"https://covid-vaccine-stage.hpfb-dgpsa.ca/taxonomy/term/16\" hreflang=\"en\">Vaccine</a>"
    prodType = product.field_product_type.replace(/(<([^>]+)>)/ig, "").trim();    // strip html, trim
    prodType = prodType.toLowerCase().startsWith("vaccin") ? productType.vaccine : productType.treatment
  }
  return prodType;
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

const getProductDateOfApprovalISO = product => {
  let approvalDate = "";
  if (typeof product.date_of_approval !== "undefined" && product.date_of_approval !== null) {
    if (product.date_of_approval.indexOf("<time ") > -1) {
      // ex: "<time datetime=\"2021-02-23T12:00:00Z\">Tue, 02/23/2021 - 12:00</time>\n"
      const $ = cheerio.load(product.date_of_approval);
      approvalDate = $('time').attr('datetime').substring(0, 10);
    }
  }
  return approvalDate;
}

const getProductDateOfApprovalFormatted = (product, language) => {
  return getFormattedDateFromHtml(product.date_of_approval, language);
}

const getFormattedDateFromHtml = (htmlDateTime, language) => {
  let formattedDate = "";
  if (typeof htmlDateTime !== "undefined" && htmlDateTime !== null) {
    if (htmlDateTime.indexOf("<time ") > -1) {
      // ex: "<time datetime=\"2021-02-23T12:00:00Z\">Tue, 02/23/2021 - 12:00</time>\n"
      const $ = cheerio.load(htmlDateTime),
        dtraw = new Date($('time').attr('datetime'));
      switch (language) {
        case lang.english:
          formattedDate = EN_MONTH[dtraw.getMonth()] + ' ' + dtraw.getDate() + ', ' + dtraw.getFullYear();
          break;
        case lang.french:
          formattedDate = dtraw.getDate() +' ' + FR_MONTH[dtraw.getMonth()] + ' ' + dtraw.getFullYear();
          break;
        default:
          formattedDate = $('time').attr('datetime').substring(0, 10);
      }
    }
  }
  return formattedDate;
}


  // TODO
  //  This is not very well tested, and I would not be surprised if it is inaccurate
const isProductNew = productApprovalDate => {
  let dtraw = new Date(productApprovalDate),
    dtutc = Date.UTC(dtraw.getFullYear(), dtraw.getMonth()+1, dtraw.getDate()),
    dtdif = Math.floor((Date.now() - dtutc) / MS_PER_DAY);
    return (dtdif <= WINDOW_IN_DAYS);
}

  // TODO
  //  This is not very well tested, and I would not be surprised if it is inaccurate
const isProductUpdated = product => {
  let isProductResourceChanged = false;
  let resources = product.resources.filter((res, ind, arr) => {
    return (res.audience.indexOf('Consumers') !== -1);
  });
  resources.forEach(res => {  
    if (isProductResourceNew(res) || isProductResourceUpdated(product, res)) {
      isProductResourceChanged = true;
    }
  });
  return isProductResourceChanged;
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

const getProductResourcePublicationStatus = (resource, language) => {
  let publicationStatus = "";
  if (typeof resource.various_dates !== "undefined" && resource.various_dates !== null) {
    // publicationStatus: various, pending, or date (formatted)
    publicationStatus = 
      resource.various_dates.toLowerCase() === "yes" 
        ? t('productDetails.listItem.publicationStatus.various') 
        : (typeof resource.date !== "undefined" && resource.date !== null)
          ? getFormattedDateFromHtml(resource.date, language)
          // resource.date.match(/<time [^>]+>([^<]+)<\/time>/)[1]    // extract time text between > and <
          : t('productDetails.listItem.publicationStatus.pending');

/*    if (!publicationStatus.includes( t('productDetails.listItem.publicationStatus.various') ) 
      && !publicationStatus.includes( t('productDetails.listItem.publicationStatus.pending') )
    ){
      publicationStatus = publicationStatus.indexOf(" - ") > -1 ? publicationStatus.substring(0, publicationStatus.indexOf(" - ")) : publicationStatus;
      publicationStatus = publicationStatus.indexOf(",") > -1 ? publicationStatus.substring(publicationStatus.indexOf(",") + 1).trim() : publicationStatus;
    } */
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

const isProductResourceNameConsumerInfo = resourceName => {
  return resourceName.toLowerCase().includes('consumer information') || resourceName.toLowerCase().includes('consommateurs');
}

const isProductResourceNew = resource => {
  // TODO
  //  This is not very well tested, and I would not be surprised if it is off by one
var isResourceNew = false;
  if (resource.date) {
//    console.log ('NEW Res --> ' + resource.resource_link)
    var $ = cheerio.load(resource.date),
      dtraw = new Date($('time').attr('datetime')),
      dtutc = Date.UTC(dtraw.getFullYear(), dtraw.getMonth(), dtraw.getDate()),
      dtdif = Math.floor((Date.now() - dtutc) / MS_PER_DAY);
    isResourceNew = (dtdif <= WINDOW_IN_DAYS);
//    console.log($('time').attr('datetime'));
//    console.log('New Date Difference: ' + Date.now() + '-' + dtutc + '=' + dtdif + ' : ' + isResourceNew);   
  }
  return isResourceNew;
}

const isProductResourceUpdated = (product, resource) => {
  // TODO
  //  This is not very well tested, and I would not be surprised if it is off by one
  var isResourceUpdated = false;
  if (product.field_vaccine_resources_export_1) {
    var $ = cheerio.load(product.field_vaccine_resources_export_1);
    $('div.paragraph--type--vaccine-resources').map( (i, el_outer) => {
      var match = null, dtraw = null;
      $(el_outer).find('div.field').map( (j, el_inner) => {

        // Inner loop is iterates over all of the Resource Details
        var fieldItem = $(el_inner).find('div.field--item').html();
        switch ($(el_inner).find('div.field--label').text()) {
          case 'Updated Date':
            dtraw = new Date($(fieldItem).attr('datetime'));
            break;
          case 'Resource link':
            if (fieldItem === resource.resource_link) {
              match = true;
            };
            break;
        }
      });

      // At this point, we have iterated over the Resource Details
      if (match && dtraw) {
        var dtutc = Date.UTC(dtraw.getFullYear(), dtraw.getMonth(), dtraw.getDate()),
          dtdif = Math.floor((Date.now() - dtutc) / MS_PER_DAY);
        if (dtdif <= WINDOW_IN_DAYS) {
          isResourceUpdated = true;
        }
        //console.log('Updated Date Difference for : ' + resource.description + ' : ' + dtdif + ' : ' + isResourceUpdated);   
      }
    });
  }
  return isResourceUpdated;
}

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
