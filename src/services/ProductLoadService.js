import { lang, covidVaccinePortal, portailVaccinCovid } from '../constants/constants';
import cheerio from 'react-native-cheerio';

// scrape metadata and consumer information from resourceLink url
const loadConsumerInformation = async (resourceLink, language) => {
  var productLoad = {
      productMetadata: [],
      consumerInformation: [],
      regulatoryAnnouncements: []
  }
  const cvtPortal = (language === lang.english) ? covidVaccinePortal : portailVaccinCovid;
  var urlPMI = cvtPortal + resourceLink
    , urlPRD = resourceLink.replace('/info', cvtPortal).replace('-' + language + '.html', '/product-details');

  await fetch(urlPMI)
  .then((resp)=>{ return resp.text() })
  .then((text)=>{ 
    var $ = cheerio.load(text), productMetadata = [], consumerInformation = [];

    // Extract Product Metadata from COVID Portal Consumer Information
    $('tbody').first().find('tr').each((i, row) => {
      var noMatch = true
        , productInfo = { 'din': null, 'name': null, 'ingredient': null, 'strength': null, 'dosageForm': null, 'routeOfAdmin': null };
      $(row).find('td').each((j, div) => {
        switch (j) {
          case 0: productInfo.din = $(div).text().trim(); break;
          case 1: productInfo.name = $(div).text().trim(); break;
          case 2: productInfo.ingredient = $(div).text().trim(); break;
          case 3: productInfo.strength = $(div).text().trim(); break;
          case 4: productInfo.dosageForm = $(div).text().trim(); break;
          case 5: productInfo.routeOfAdmin = $(div).text().trim(); break;
        }
      });

      // If two Products are identical, just add the DIN to the existing Product instead of adding it to the Product Metadata array
      productMetadata.forEach((prodInfo, ind) => {
        const existProduct = [prodInfo.name, prodInfo.ingredient, prodInfo.strength, prodInfo.dosageForm, prodInfo.routeOfAdmin].join('|')
        const matchProduct = [productInfo.name, productInfo.ingredient, productInfo.strength, productInfo.dosageForm, productInfo.routeOfAdmin].join('|');
        if (existProduct === matchProduct) {
          prodInfo.din += (', ' + productInfo.din);
          noMatch = false;
        }
      });
      if (noMatch) {
        productMetadata.push(productInfo);
      }
    });

    //Extract Accordion data from COVID Portal Consumer Information
    $('details.span-8').parent().each((i, detail) => {
      const accordionItem = {
        summary: $(detail).find('summary').text(),
        html: $(detail).find('div').html(),
        key: 'cons-' + i
      };
      consumerInformation.push(accordionItem);
    });

    productLoad.productMetadata = productMetadata;
    productLoad.consumerInformation = consumerInformation;
  })
  .catch (error => {
    console.log('Unable to load Consumer Information for product (check resource link). ', error);
  });

  await fetch(urlPRD)
  .then((resp)=>{ return resp.text() })
  .then((text)=>{ 
    var $ = cheerio.load(text), regulatoryAnnouncements = [];

    // Extract Regulatory Announcements from Product Details Page
    $('div.view-vaccine-news').find('tbody').find('tr').each((i, row) => {
    var regulatoryAnnouncement = { 'key': null, 'date': null, 'description': null, 'link': null };
      $(row).find('td').each((j, td) => {
        switch (j) {
          case 0: 
            regulatoryAnnouncement.link = $(td).find('a').attr('href').trim(); 
            regulatoryAnnouncement.description = $(td).find('a').html().trim(); 
            break;
          case 1: regulatoryAnnouncement.date = $(td).text().trim(); break;
        }
        regulatoryAnnouncement.key = 'reg-' + i;
      });
      regulatoryAnnouncements.push(regulatoryAnnouncement);
    });

      productLoad.regulatoryAnnouncements = regulatoryAnnouncements;
    })
  .catch (error => {
    console.log('Unable to load Product Details for product (check resource link). ', error);
  });

  return productLoad;
}

export default {
  loadConsumerInformation
};
