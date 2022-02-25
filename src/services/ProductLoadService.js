/* eslint-disable no-console */
import cheerio from 'react-native-cheerio';
import he from 'he';
import ProductsParserService from './ProductsParserService';
import {
  lang,
  covidVaccinePortal,
  portailVaccinCovid
} from '../constants/constants';
import {
  fetchProductsAsync,
  fetchProductNewsAsync
} from '../api/covid19Products';
import { getDateWithTimezoneOffset, formatDate } from '../shared/date-fns';

const decode = (value) => {
  return JSON.parse(
    he.decode(JSON.stringify(value).replace(/&quot;/gi, '\\"')) // &quot; expected only in string values, so escape for decode
  );
};

const fetchProducts = async () => {
  let products = [];
  try {
    products = await fetchProductsAsync();
    products = products.filter((product) => {
      return !ProductsParserService.isProductUnderReview(product);
    });
    products = decode(products);
  } catch (error) {
    console.log('Could not fetch Covid-19 Products from api. ', error);
  }
  return products;
};

const fetchProductNews = async (language, nid) => {
  let productNews = [];
  try {
    productNews = await fetchProductNewsAsync(language, nid);
    productNews = decode(productNews);
    if (Array.isArray(productNews) && productNews.length > 1) {
      productNews.sort(
        (a, b) => (a.publish_date > b.publish_date ? -1 : 1) // desc
      );
    }
  } catch (error) {
    console.log(
      `Could not fetch product news (e.g. regulatory announcements) for product ${nid} from api. `,
      error
    );
  }
  return productNews;
};

// eslint-disable-next-line no-undef
const headers = new Headers();
headers.append('Pragma', 'no-cache');
headers.append('Cache-Control', 'no-cache');

// scrape metadata and consumer information from resourceLink url (not in api)
// fetch regulatory announcements from api
const loadConsumerInformation = async (resourceLink, language, nid) => {
  const productLoad = {
    productMetadata: [],
    consumerInformation: [],
    regulatoryAnnouncements: []
  };
  const cvtPortal =
    language === lang.english ? covidVaccinePortal : portailVaccinCovid;
  const urlPMI = cvtPortal + resourceLink;

  const requestInit = {
    method: 'GET',
    headers
  };
  await fetch(urlPMI, requestInit)
    .then((resp) => {
      return resp.text();
    })
    .then((text) => {
      const $ = cheerio.load(text);
      const productMetadata = [];
      const consumerInformation = [];

      // Extract Product Metadata from COVID Portal Consumer Information
      $('tbody')
        .first()
        .find('tr')
        .each((i, row) => {
          let noMatch = true;
          const productInfo = {
            din: null,
            name: null,
            ingredient: null,
            strength: null,
            dosageForm: null,
            routeOfAdmin: null
          };
          $(row)
            .find('td')
            .each((j, div) => {
              switch (j) {
                case 0:
                  productInfo.din = $(div).text().trim();
                  break;
                case 1:
                  productInfo.name = $(div).text().trim();
                  break;
                case 2:
                  productInfo.ingredient = $(div).text().trim();
                  break;
                case 3:
                  productInfo.strength = $(div).text().trim();
                  break;
                case 4:
                  productInfo.dosageForm = $(div).text().trim();
                  break;
                case 5:
                  productInfo.routeOfAdmin = $(div).text().trim();
                  break;
                default:
                  break;
              }
            });

          // If two Products are identical, just add the DIN to the existing Product instead of adding it to the Product Metadata array
          productMetadata.forEach((prodInfo) => {
            const existProduct = [
              prodInfo.name,
              prodInfo.ingredient,
              prodInfo.strength,
              prodInfo.dosageForm,
              prodInfo.routeOfAdmin
            ].join('|');
            const matchProduct = [
              productInfo.name,
              productInfo.ingredient,
              productInfo.strength,
              productInfo.dosageForm,
              productInfo.routeOfAdmin
            ].join('|');
            if (existProduct === matchProduct) {
              // eslint-disable-next-line no-param-reassign
              prodInfo.din += ', '.concat(productInfo.din);
              noMatch = false;
            }
          });
          if (noMatch) {
            productMetadata.push(productInfo);
          }
        });

      // Extract Accordion data from COVID Portal Consumer Information
      $('details.span-8')
        .parent()
        .each((i, detail) => {
          const accordionItem = {
            summary: $(detail).find('summary').text(),
            html: $(detail)
              .find('div')
              .html()
              .replace(/<br>\n/gm, '<br />')
              .replace(/(\r\n|\n|\r)/gm, ' ')
              // eslint-disable-next-line no-useless-escape
              .replace(/src=\"images\//g, `src=\"${cvtPortal}/info/images/`),
            key: 'cons-'.concat(i)
          };
          consumerInformation.push(accordionItem);
        });

      productLoad.productMetadata = productMetadata;
      productLoad.consumerInformation = consumerInformation;
    })
    .catch((error) => {
      console.log(
        'Unable to load Consumer Information for product (check resource link). ',
        error
      );
    });

  // Fetch Regulatory Announcements from API
  const regulatoryAnnouncements = [];
  try {
    const productNews = await fetchProductNews(language, nid);
    productNews.forEach((ra) => {
      const regulatoryAnnouncement = {
        key: null,
        date: null,
        description: null,
        link: null
      };
      regulatoryAnnouncement.key = 'reg-'.concat(ra.nid);
      regulatoryAnnouncement.date = formatDate(
        getDateWithTimezoneOffset(ra.publish_date),
        language
      );
      regulatoryAnnouncement.description = ra.title;
      regulatoryAnnouncement.link = ra.article_link;
      regulatoryAnnouncements.push(regulatoryAnnouncement);
    });
    productLoad.regulatoryAnnouncements = regulatoryAnnouncements;
  } catch (error) {
    console.log(
      `Unable to load regulatory announcements for product ${nid}. `,
      error
    );
  }

  return productLoad;
};

const setConsumerInformation = async (inProduct) => {
  const product = inProduct;
  const consumerInformationResource = [];
  const resourceLang = product.language.toLowerCase().substring(0, 2);
  consumerInformationResource.push(
    product.resources.find((resource) => {
      return (
        ProductsParserService.isProductResourceForConsumers(resource) &&
        resource
      );
    })
  );
  const productPortalInfo = await loadConsumerInformation(
    ProductsParserService.getProductResourceLink(
      consumerInformationResource[0],
      resourceLang
    ),
    resourceLang,
    product.nid
  );
  product.productMetadata = productPortalInfo.productMetadata;
  product.consumerInformation = productPortalInfo.consumerInformation;
  product.regulatoryAnnouncements = productPortalInfo.regulatoryAnnouncements;
  return product;
};

export default {
  fetchProducts,
  fetchProductNews,
  loadConsumerInformation,
  setConsumerInformation
};
