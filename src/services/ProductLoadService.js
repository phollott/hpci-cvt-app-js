import cheerio from 'react-native-cheerio';
import he from 'he';
import {
  lang,
  covidVaccinePortal,
  portailVaccinCovid
} from '../constants/constants';
import { fetchProductNewsAsync } from '../api/covid19Products';
import ProductsParserService from './ProductsParserService';

const fetchProductNews = async (language, nid) => {
  let productNews = [];
  try {
    productNews = await fetchProductNewsAsync(language, nid);
    productNews = JSON.parse(
      he.decode(JSON.stringify(productNews).replace(/&quot;/gi, '\\"')) // &quot; expected only in string values, so escape for decode
    );
    if (Array.isArray(productNews) && productNews.length > 1) {
      productNews.sort(
        (a, b) =>
          a.field_publish_date_export > b.field_publish_date_export ? -1 : 1 // desc
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      `Could not fetch product news (e.g. regulatory announcements) for product ${nid} from api. `,
      error
    );
  }
  return productNews;
};

// scrape metadata and consumer information from resourceLink url
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

  await fetch(urlPMI)
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
            html: $(detail).find('div').html(),
            key: 'cons-'.concat(i)
          };
          consumerInformation.push(accordionItem);
        });

      productLoad.productMetadata = productMetadata;
      productLoad.consumerInformation = consumerInformation;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
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
      regulatoryAnnouncement.date = ProductsParserService.getFormattedDateFromHtml(
        ra.field_publish_date_export,
        language
      );
      regulatoryAnnouncement.description = ra.title;
      regulatoryAnnouncement.link = ra.field_article_link;
      regulatoryAnnouncements.push(regulatoryAnnouncement);
    });
    productLoad.regulatoryAnnouncements = regulatoryAnnouncements;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      `Unable to load regulatory announcements for product ${nid}. `,
      error
    );
  }

  return productLoad;
};

export default {
  loadConsumerInformation
};
